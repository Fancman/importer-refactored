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

		this._router.post('/', async (req, res, next) => {
			this.storeCatalog(req, res, next)
		})

		this._router.get('/counts', async (req, res, next) => {
			this.getCatalogCounts(req, res, next)
		})

		this._router.patch('/scraper-config', async (req, res, next) => {
			this.addScraperConfig(req, res, next)
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
			let counts = await this.productRepository.getCatalogStatusesCount()

			res.send(counts)

		} catch (error) {
			res.status(404)
			res.end(error.message)
		}
	}

	async storeCatalog(req, res, next){
		
		try {
			let title = req.body.title
			let url = req.body.url

			let catalog = await this.catalogRepository.storeCatalog(title, url)

			res.send(catalog)

		} catch (error) {
			res.status(404)
			res.end(error.message)
		}

	}

	async addScraperConfig(req, res, next){
		
		try {
			let selectedScraper = req.body.selectedScraper
			let selectedCatalog = req.body.selectedCatalog
			let scraper_links = req.body.scraper_links

			let catalog = await this.catalogRepository.addScraperConfig(selectedScraper, selectedCatalog, scraper_links)

			res.send(catalog)

		} catch (error) {
			res.status(404)
			res.end(error.message)
		}

	}


}