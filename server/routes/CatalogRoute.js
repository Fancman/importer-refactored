import Route from './_index.js'

import CatalogRepositoryFascade from "../../database/repositories/Catalog.js"

export default class ShopRoute extends Route {

	constructor () {
		super()

		this.catalogRepository = new CatalogRepositoryFascade()
	}

	indexRoutes(){
		this._router.get('/', async (req, res, next) => {
			this.getCatalogs(req, res, next)
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

}