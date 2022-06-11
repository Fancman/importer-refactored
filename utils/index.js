
import fs from "fs"
import xml2js from "xml2js"
import download from "download";

class Singleton {

    constructor() {
        this.message = 'I am an instance';
    }

	static async sleep (ms) {
		return new Promise(resolve => setTimeout(resolve, ms));
	}

	static extractPrice (priceStr) {
		if(priceStr === null || priceStr === undefined){
			return null
		}
	
		let numbers = priceStr.match(/\d+(?:\,\d+)?/g)
	
		if( numbers.length ){
			return numbers[0]
		}
	
		return null
	}

	static clearText (str) {
		str = str.replace(/(\r\n\t|\n|\r\t)/gm, "")
		str = str.replace(/\s\s+/g, ' ')
		str = str.trim()
		return str
	}
	
	static async getRandomInt (min, max) {
		min = Math.ceil(min);
		max = Math.floor(max);
		return Math.floor(Math.random() * (max - min) + min);
	}

	static async downloadFile (url, filename) {
		return fs.writeFileSync(`storage/${filename}`, await download(url))
	}

	static async parseFile (fields, filename){
		return new Promise((resolve, reject) => {
			let filePath = `storage/${filename}`

			let xml_string = fs.readFileSync(filePath, "utf8");

			let parser = new xml2js.Parser({ attrkey: "ATTR" })
	
			parser.parseString(xml_string, async (error, result) => {
				if(error === null) {
					let items = null
					let catalog_type = null
	
					if(result.hasOwnProperty('rss')
					&& result['rss'].hasOwnProperty('channel')
					&& result['rss']['channel'][0].hasOwnProperty('item')){
						items = result['rss']['channel'][0]['item']
						catalog_type = 'google'
					}else if(result.hasOwnProperty('SHOP')
					&& result['SHOP'].hasOwnProperty('SHOPITEM')){
						items = result['SHOP']['SHOPITEM']
						catalog_type = 'heureka'
					}
	
					if(catalog_type == null || items == null){
						return reject({ 
							error: "Unknown catalog type",
							catalog_type: catalog_type,
							items: items,
							test: items = result['rss']['channel']
						})
					}
	
					let allFields = {}
					let products = []
	
					console.log(`Products: ${items.length}, Catalog type: ${catalog_type}`)
	
					await Promise.all(items.map(async (item) => {
	
						for (const [key, value] of Object.entries(item)) {
							if(!allFields.hasOwnProperty(key)){
								allFields[key] = value
							}
							//console.log(`${key}: ${value}`);
						}
	
						let product = {}
	
						for (const [field_name, field_value_obj] of Object.entries(fields[catalog_type])) {
							if(item.hasOwnProperty(field_name)){
								// ANCHOR Params processing for heureka
								if(catalog_type == 'heureka' && field_value_obj['tag_name'] == 'params'){
									let params = {}
	
									item[field_name].forEach(param => {
										let param_name = param['PARAM_NAME'][0]
										let param_val = param['VAL'][0]
	
										//console.log(param_name, param_val)
	
										if(params.hasOwnProperty(param_name)){
											if(!params[param_name].includes(param_val)){
												params[param_name].push(param_val)
											}
										}else{
											params[param_name] = [param_val]
										}
									})
	
									product['params'] = params
								} else if (catalog_type == 'heureka' && field_value_obj['tag_name'] == 'category_arr') {
									product['category_arr'] = item[field_name][0]['CATEGORY']
								} else {
									product[field_value_obj['tag_name']] = item[field_name][0]
								}
	
							}
						}
	
						products.push(product)
	
					}));
	
					let unsaved_keys = {}
	
					for (const [field_key, field_value] of Object.entries(allFields)) {
						if(!fields[catalog_type].hasOwnProperty(field_key)){
							unsaved_keys[field_key] = field_value
						}
					}
	
					return resolve({
						'unsaved_keys': unsaved_keys,
						'products': products
					})
				}
				else {
					return reject({ error: error })
				}
			})
		})
	}

	static chunk (items, size) {  
		const chunks = []
		items = [].concat(...items)
	  
		while (items.length) {
		  chunks.push(
			items.splice(0, size)
		  )
		}
	  
		return chunks
	}
}

export default new Singleton();