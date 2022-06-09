//import { CatalogModel } from '../models/Catalog.js'
import { ProductModelCollection } from '../models/Product.js'

import CatalogRepositoryFascade from "../../database/repositories/Catalog.js"

export default class ProductRepositoryFascade {

	async getModelByCatalogSlug(catalogSlug){
		try {
			let model = await ProductModelCollection(`catalog_products_${catalogSlug}`)
			
			return model
		} catch (error) {
			return null
		}
	}

	async findOne(Model, record) {
		return new Promise(async (resolve, reject) => {
			try {
				let doc = Model.findOne(record)
				return resolve(doc)
			} catch (error) {
				return reject(error)
			}
		})
	}

	async insertRecord(Model, record) {
		return new Promise(async (resolve, reject) => {
			try {
				let doc = Model.create(record)
				return resolve(doc)
			} catch (error) {
				return reject(error)
			}
		})
	}

	async storeLinks(data) {
		let { scraper_name, links, catalog_slug } = data

		let model = await this.getModelByCatalogSlug(catalog_slug)

		for(const link of links){

			try {
				let product = await this.findOne(model, {url: link})
	
				if( product !== null ){
					continue
				}
		
				let productObj = {
					url: link,
					scraper_name: scraper_name,
				}
		
				await this.insertRecord(model, productObj)

			} catch (error) {
				return null
			}
		}
	}

	async storeProduct(data) {
		try {
			let { response, id, catalog_slug } = data
			let record = {}
	
			let model = await this.getModelByCatalogSlug(catalog_slug)
	
			for (const [field_name, field_value] of Object.entries(response)) {
				
				if (field_name === 'errors') {
					continue;
				}
		
				record[field_name] = field_value
			}
	
			record.status = 'scraped'
	
			let product = await this.findUpdateById(model, {
				$set: record
			}, id)
	
			return product

		} catch (error) {
			return null
		}
	
	}

	async findUpdateById(Model, record, id) {
		return new Promise(async (resolve, reject) => {
			 Model.findByIdAndUpdate(id, record, function(err, doc) {
	
				if(err){
					reject(err)
				}
	
				resolve(doc)
			})
		})
	}

	async getProductsWithNoneStatus(catalogSlug, criteria){
		try {
			let model = await this.getModelByCatalogSlug(catalogSlug)

			let products = await model.find(criteria).exec();

			return products

		} catch (error) {
			return null
		}
	}
	
	async getCatalogStatusesCount(){
		try {
			let outputArr = {}

			let catalogs = await new CatalogRepositoryFascade().findCatalogs()

			for( let catalog of catalogs ) {

				let catalogSlug = catalog.slug
				let catalogScrapers = catalog.scrapers

				for( let scraper of catalogScrapers ) {

					let scraperName = scraper.name

					let Model = await this.getModelByCatalogSlug(catalogSlug)
					let statusesCounts = await this.getStatusesCounts(Model, scraperName)


					if( !outputArr.hasOwnProperty( catalogSlug ) ) {
						outputArr[catalogSlug] = {}
					}

					let outputData = {}

					for( let statusesCount of statusesCounts ){
						outputData[statusesCount['_id']] = statusesCount['count']
					}
		
					outputArr[catalogSlug][scraperName] = outputData
				}

			}

			return outputArr
			
		} catch (error) {
			return null
		}
	}

	async getStatusesCounts(Model, scraperName)
	{
		try {
			let counts = await Model.aggregate([
				{
					$match: 
					{
						scraper_name: scraperName
					}
				},
				{
					$group: 
					{
						_id: "$status",
						count: { $sum: 1 }
					}
				}
			])

			return counts
		} 
		catch (error) {
			return null
		}
	}

}