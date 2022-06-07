import Route from './_index.js'

import CatalogRepositoryFascade from "../../database/repositories/Catalog.js"
import ProductRepositoryFascade from "../../database/repositories/Product.js"

export default class ShopRoute extends Route {

	constructor () {
		super()

		this.catalogRepository = new CatalogRepositoryFascade()
		this.productRepository = new ProductRepositoryFascade()
	}

	indexRoutes(){
		this._router.get('/', async (req, res, next) => {
			this.getCatalogs(req, res, next)
		})

		this._router.get('/counts', async (req, res, next) => {
			this.getCatalogCounts(req, res, next)
		})
	}

	async getCatalogs(req, res, next)
	{
		try {
			let catalogs = await this.catalogRepository.findCatalogs()

			res.send(catalogs)

		} catch (error) {
			res.status(404)
			res.end(error.message)
		}
	}

	async getCatalogCounts(req, res, next){
		try {
			let catalogCounts = await this.productRepository.getCatalogStatusesCount()

			res.send(catalogCounts)

		} catch (error) {
			res.status(404)
			res.end(error.message)
		}
	}



}