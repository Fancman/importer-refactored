//import { CatalogModel } from '../models/Catalog.js'
import { ProductModel, ProductModelCollection } from '../models/Product.js'

import CatalogRepositoryFascade from "../../database/repositories/Catalog.js"

import DBUtils from './DBUtils.js'

import Utils from '../../utils/index.js'

export default class ProductRepositoryFascade {

	async findImagesCounts( catalog_slug, scraper_name )
	{
		try {
			let model = await this.getModelByCatalogSlug(catalog_slug)

			let query1 = {
				$and: [
					{
						$or: [
							{extension_image: ''},
							{extension_image: {$exists : false}}
						]
					},
					{
						scraper_name: scraper_name
					},
					{
						primary_image: {$exists : true}
					}
				]
			}

			let query2 = {
				$and: [
					{extension_image: {$exists : true}},
					{scraper_name: scraper_name},
					{primary_image: {$exists : true}}
				]
			}

			let withoutImagesCount = await model.find(query1).count();
			let withImagesCount = await model.find(query2).count();

			return {
				withoutImagesCount: withoutImagesCount,
				withImagesCount: withImagesCount
			}
		} 
		catch (error) {
			return null
		}
	}

	async saveImage(data) {
		const { products, catalog_slug } = data

		for (let product of products) {

			let randomInt = Utils.getRandomInt(1500, 10000)

			try {
				let primary_image = product.primary_image
				let id = product._id
	
				let extension = await Utils.downloadImage(primary_image, 'storage/images/' + catalog_slug + '/', id)
	
				if ( extension ) {
					await this.updateImageExt(id, catalog_slug, extension)
				}

				await Utils.sleep(randomInt)

			} catch (error) {
				console.log(error)

				await Utils.sleep(randomInt)

				continue
			}
			
		}
		
	}

	async findWithoutDownloadedImages(catalog_slug, scraper_name) {
		let query = {
			$and: [
				{
					$or: [
						{extension_image: ''},
						{extension_image: {$exists : false}}
					]
				},
				{
					scraper_name: scraper_name
				},
				{
					primary_image: {$exists : true}
				}
			]
		}
	
		let model = await this.getModelByCatalogSlug(catalog_slug)

		return await DBUtils.find(model, query)
	}

	async paginate( catalog_slug, filter, options ) {
		let model = await this.getModelByCatalogSlug(catalog_slug)

		return await model.paginate(filter, options)
	}

	async search( catalog_slug, input, category, status ) {
		let queries = []

		if ( status !== "all" ) {
			queries.push({
				status: status
			})
		}

		if ( category !== undefined && category !== null && category !== 0 ) {
			let lft = category.lft
			let rgt = category.rgt
	
			queries.push({
				$and : [
					{ 'category.lft': { $gte: lft }},
					{ 'category.rgt': { $lte: rgt }}
				]
			})
		}

		if ( input !== undefined && input !== ""){
			let re = new RegExp(input, 'i')
	
			queries.push({
				$or: [
					{title: { $regex: re }},
					{description: { $regex: re }}
				]
			})
		}

		if ( category == 0 ) {
			queries.push({
				$or: [
					{category: { $exists : false }},
					{category: null}
				]
			})
		}

		let finalQuery = {}

		if ( queries.length > 0 ) {
			finalQuery = {
				$and: queries
			}
		}

		let model = await this.getModelByCatalogSlug(catalog_slug)

		return await DBUtils.find(model, finalQuery)
	}

	async updateImageExt(product_id, catalog_slug, extension) {
		let model = await this.getModelByCatalogSlug(catalog_slug)

		return await DBUtils.findUpdateById(model, 
			{
				$set: {
					extension_image: extension
				}
			},
			product_id
		)
	}

	async updateProductsCategory(catalog_slug, products_ids, category) {
		let model = await this.getModelByCatalogSlug(catalog_slug)

		let products = await DBUtils.updateMany(model, 
			{ _id: { $in: products_ids } },
			{ category: category }
		)

		return products
	}

	async getModelByCatalogSlug(catalogSlug){
		try {
			let model = await ProductModelCollection(`catalog_products_${catalogSlug}`)
			
			return model
		} catch (error) {
			return null
		}
	}

	async storeLinks(data) {
		let { scraper_name, links, catalog_slug } = data

		let model = await this.getModelByCatalogSlug(catalog_slug)

		let totalNumberOfLinks = links.length
		let alreadySavedLinks = 0
		let savedLinks = 0

		for ( const link of links ) {

			try {
				let product = await DBUtils.findOne(model, {url: link})
	
				if( product !== null ){
					alreadySavedLinks++

					continue
				}
		
				let productObj = {
					url: link,
					scraper_name: scraper_name,
				}
		
				await DBUtils.insertRecord(model, productObj)

				savedLinks++

			} catch (error) {
				return null
			}
			
		}

		console.log(`Pagination links - Already saved: ${alreadySavedLinks}`, `Saved: ${savedLinks}`, `Total: ${totalNumberOfLinks}`)

	}

	async storeProduct(data) {
		try {
			let { response, id, catalog_slug } = data
			let record = {}
	
			let model = await this.getModelByCatalogSlug(catalog_slug)
	
			for (const [field_name, field_value] of Object.entries(response)) {
				
				/*if (field_name === 'errors') {
					continue;
				}*/
		
				record[field_name] = field_value
			}
	
			record.status = 'scraped'
	
			let product = await DBUtils.findUpdateById(model, {
				$set: record
			}, id)
	
			return product

		} catch (error) {
			return null
		}
	
	}

	async deactivateProduct(data) {
		try {
			let { response, id, catalog_slug } = data
			let record = {}
	
			let model = await this.getModelByCatalogSlug(catalog_slug)
	
			for (const [field_name, field_value] of Object.entries(response)) {
				
				if ( !['errors', 'fieldErrors'].includes(field_name) ) {
					continue;
				}
		
				record[field_name] = field_value
			}
	
			record.status = 'deactivated'
	
			let product = await DBUtils.findUpdateById(model, {
				$set: record
			}, id)
	
			return product

		} catch (error) {
			return null
		}
	
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