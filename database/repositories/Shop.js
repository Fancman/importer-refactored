import { ShopModel } from '../models/Shop.js'
import { GoogleModelCollection } from '../models/Google.js'
import { HeurekaModelCollection } from '../models/Heureka.js'

import DBUtils from './DBUtils.js'

export default class ShopRepositoryFascade {

	async getShopSourceXML(shop, source_type){

		let sources = shop.sources
		let sourceURL = null
	
		sources.forEach(source => {
			if(source_type === source.source_type){
				sourceURL = source.source_config.source_url
			}
		})
	
		return sourceURL
	}

	async storeShop(title, source_type, source_config){
		try {
			let model = await ShopModel
			let shop = model.create({
				title: title,
				sources: [
					{
						source_type: source_type,
						source_config: source_config
					}
				]
			})
	
			return shop
		} 
		catch (error) {
			return null
		}
	}

	async findShopAndUpdateByTitle(title, newShop){
		try {
			let model = await ShopModel
			let shop = model.findOneAndUpdate({title: title}, newShop, {
				returnOriginal: false
			})
	
			return shop
		} 
		catch (error) {
			return null
		}
	}

	async deleteShopById(id)
	{
		try {
			let model = await ShopModel
			let shop = await model.deleteOne( { _id: id} ).exec();

			return shop
		} 
		catch (error) {
			return null
		}
	}

	async findShopByTitle(title)
	{
		try {
			let model = await ShopModel
			return await DBUtils.findOne(model, { title: title})
		} 
		catch (error) {
			return null
		}
	}

	async findShopById(id)
	{
		try {
			let model = await ShopModel
			return await DBUtils.findOne(model, { _id: id})
		} 
		catch (error) {
			return null
		}
	}

	async findAllLeanShops()
	{		
		try {
			let model = await ShopModel
			let shops = await model.find().lean().exec();

			return shops
		} 
		catch (error) {
			return null
		}
	}

	async getSourceTypeModel(sourceType, sourceCollection){
		let model = null

		if(sourceType === 'google'){
			model = await GoogleModelCollection(sourceCollection)
		}
		else if (sourceType === 'heureka'){
			model = await HeurekaModelCollection(sourceCollection)
		}

		return model
	}

	async findAllLeanShopsWithCounts( shops ){
		for (const [index, shop] of shops.entries()) {

			if(shop.sources.length){

				for (const [i, source] of shop.sources.entries()) {

					let source_collection = source.source_collection
					let source_type = source.source_type	
					
					try {
						let model = await this.getSourceTypeModel(source_type, source_collection)
						let cnt =  await DBUtils.getCount(model)

						shops[index].sources[i]['cnt'] = cnt 

					} catch (error) {
						console.log(error)
					}
				}
			}

		}

		return shops
	}

	async findProductBySku(Model, sku) {
		return new Promise( (resolve) => {
			try {
				Model.findOne({sku: sku}).then( (product) => {
					return resolve(product)
				})
			} catch (error) {
				return resolve(null)
			}
		})
	}

}