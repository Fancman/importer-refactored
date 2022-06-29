
import fs from "fs"
import ProductRepositoryFascade from "./database/repositories/Product.js";


async function readJSON (filename){
	return new Promise((resolve) => {
		fs.readFile(filename, (err, data) => {
			if (err) throw err;
			return resolve(data)
		});
	})
}

(async () => {
	let rawdata = await readJSON('storage/ludora_sk.json');
	let table = JSON.parse(rawdata);

	for ( const row of table ) {

		if ( row.hasOwnProperty('data') ) {

			let types = {
				'size' : 'sizes',
				'material' : 'materials',
				'drahokam' : 'gems',
				'zlato' : 'gold'
			}

			let allTypes = []
			let allScrapers = []
			let products = []

			for ( const product of row['data'] ) {

				let productClean = {}				

				if (product.hasOwnProperty('attributes') ) {

					let attrArr = []

					let attributesJSON = JSON.parse(product['attributes'])

					for ( const attribute of attributesJSON) {

						let attrVal = attribute['attribute_val']
						let attrType = attribute['attribute_type']
						let attrSlug = attribute['attribute_val_slug']

						if ( attrVal === null || attrType === null || attrSlug === null ) {
							continue
						}

						let newType = types[attrType]

						if ( !Object.hasOwn(attrArr, newType) ) {
							attrArr[newType] = []
						}

						if ( !allTypes.includes(attrType) ) {
							allTypes.push(attrType)
						}

						attrArr[newType].push({
							attrVal,
							attrSlug
						})
					}

					if (attrArr.length > 0) {
						productClean['attr'] = attrArr
					}
					//console.log(attrArr)
				}

				if ( !allScrapers.includes(product.shop_name) ) {
					allScrapers.push(product.shop_name)
				}

				productClean['url'] = product.link				
				productClean['old'] = {
					'slug' : product.slug,
					'id' : product.product_id,
					'category_id' : product.category_id,
					'category_parent' : product.category_parent,
					'category_parent' : product.category_slug,
					'shop_name' : product.shop_name,
					'shop_contains' : product.shop_contains
				}

				//console.log(productClean)

				if ( !Object.hasOwn(products, product.shop_name) ) {
					products[product.shop_name] = []
				}

				products[product.shop_name].push(productClean)

			}

			console.log(allTypes)
			console.log(allScrapers)

			for (const [scraper_name, links] of Object.entries(products)) {
				console.log(`${scraper_name}: ${links.length}`)

				let productRepositoryFascade = new ProductRepositoryFascade()

				await productRepositoryFascade.storeLinksUpsert({
					'scraper_name' : scraper_name,
					"links" : links,
					'catalog_slug' : 'ludorask'
				})
			}
			  

			


		}
	}

})();

/*

SELECT s.product_id, 
JSON_ARRAYAGG(JSON_OBJECT('attribute_type',s.type, 'attribute_val', s.val, 'attribute_val_slug', s.val_slug)) as attributes,
p.slug,
p.link,
cn.id as category_id,
cn.slug as category_slug,
cn.parent as category_parent,
pa.meno as shop_name,
pa.contains as shop_contains
from store s
LEFT JOIN products p ON s.product_id = p.id
LEFT JOIN products_categories pc ON p.id = pc.product_id
LEFT JOIN categories_new cn ON pc.category_id = cn.id
LEFT JOIN partners pa ON pa.id = p.shop
WHERE p.state = 0
AND cn.parent IS NOT NULL
GROUP BY s.product_id

*/