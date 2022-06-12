import Route from './_index.js'

import ShopRepositoryFascade from "../../database/repositories/Shop.js"

import Utils from '../../utils/index.js'

import slugify from 'slugify'

import fieldsXML from '../../utils/fields.js'

export default class ProductRoute extends Route {

	constructor () {
		super()

		this.shopRepository = new ShopRepositoryFascade()
	}

	indexRoutes(){
		this._router.post('/update-category', async (req, res, next) => {
			this.updateCategory(req, res, next)
		})
	}


	async updateCategory(req, res, next)
	{
		try {
			let catalog_slug = req.body.catalog
			let products_ids = req.body.ids
			let category = req.body.category

			let products = await this.productRepository.updateProductsCategory(
				catalog_slug,
				products_ids,
				category
			)

			return res.send(products)
			
		} catch (error) {
			res.status(404)
			return res.end(error.message)
		}

	}

}