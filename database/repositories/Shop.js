import { ShopModel } from '../models/Shop.js'
import { GoogleModelCollection } from '../models/Google.js'
import { HeurekaModelCollection } from '../models/Heureka.js'

export default class ShopRepositoryFascade {

	async findShopById(id)
	{
		try {
			let model = await ShopModel
			let shop = await model.findOne( { _id: id} ).exec();

			return shop
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

	async findAllLeanShopsWithCounts(shops){
		for (const [index, shop] of shops.entries()) {

			if(shop.sources.length){

				for (const [i, source] of shop.sources.entries()) {

					let source_collection = source.source_collection
					let source_type = source.source_type	
					
					try {
						let cnt = 0

						if(source_type == 'google'){
							let model = await GoogleModelCollection(source_collection)
							cnt = await this.getCnt(model)
						}
						else if (source_type == 'heureka'){
							let model = await HeurekaModelCollection(source_collection)
							cnt = await this.getCnt(model)
						}

						shops[index].sources[i]['cnt'] = cnt 

					} catch (error) {
						console.log(error)
					}
				}
			}

		}

		return shops
	}

	async getCnt(Model) {
		return new Promise(async (resolve, reject) => {
			 Model.count({}, function(err, count) {
				resolve(count)
			});
		})
	}

}