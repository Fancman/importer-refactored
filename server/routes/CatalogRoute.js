import Route from './_index.js'

import CatalogRepositoryFascade from "../../database/repositories/Catalog.js"
import ProductRepositoryFascade from "../../database/repositories/Product.js"

import EventsObserver from "../../database/Observer.js"

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

		this._router.post('/download-images', async (req, res, next) => {
			this.downloadImages(req, res, next)
		})
		
		this._router.get('/counts', async (req, res, next) => {
			this.getCatalogShopsCounts(req, res, next)
		})

		this._router.get('/catalog-counts', async (req, res, next) => {
			this.getCatalogCounts(req, res, next)
		})

		this._router.patch('/scraper-config', async (req, res, next) => {
			this.addScraperConfig(req, res, next)
		})

		this._router.post('/load-images-counts', async (req, res, next) => {
			this.catalogImagesCounts(req, res, next)
		})
		
	}

	async catalogImagesCounts(req, res, next)
	{
		try {
			let catalog_slug = req.body.catalog.slug
			let scraper_name = req.body.scraper.name

			let counts =  await this.productRepository.findImagesCounts(catalog_slug, scraper_name)

			return res.send(counts)
		} catch (error) {
			res.status(400)
			return res.end(error.message)
		}
	}

	async downloadImages(req, res, next)
	{
		try {
			let catalog_slug = req.body.catalog.slug
			let scraper_name = req.body.scraper.name

			let products =  await this.productRepository.findWithoutDownloadedImages(catalog_slug, scraper_name)

			EventsObserver.emit('save_image', {
				products: products,
				catalog_slug: catalog_slug,
			})

			return res.send('ok')
		} catch (error) {
			res.status(400)
			return res.end(error.message)
		}
	}

	async getCatalogs(req, res, next)
	{
		try {
			let catalogs = await this.catalogRepository.findCatalogs()

			return res.send(catalogs)
		} catch (error) {
			res.status(400)
			return res.end(error.message)
		}
	}

	async getCatalogShopsCounts(req, res, next){
		try {
			let counts = await this.productRepository.getCatalogStatusesCount()

			return res.send(counts)

		} catch (error) {
			res.status(400)
			return res.end(error.message)
		}
	}

	async getCatalogCounts(req, res, next){
		try {

			let outputArr = {}

			let catalogs = await new CatalogRepositoryFascade().findCatalogs()

			for ( let catalog of catalogs ) {
				let catalog_slug = catalog.slug

				let Model = await this.productRepository.getModelByCatalogSlug(catalog_slug)

				let countsData = await this.catalogRepository.getCatalogStatusesCount(Model)

				let cleanCounts = {}

				for ( const countPivot of countsData ) {
					let _id = countPivot['_id']
					let count = countPivot['count']

					if (  _id.hasOwnProperty('status') ) {

						let status = _id['status']

						if ( ! cleanCounts.hasOwnProperty(status) ) {
							cleanCounts[status] = []
						}

						let arrAdded = {
							'values' : [],
							'count' : 0,
						}

						if ( _id.hasOwnProperty('active') ) {
							arrAdded['values'].push({
								'status_name' : 'active',
								'status_value' : ( _id['active'] === 1 ? 'YES' : 'NO' )
							})
						}

						if ( _id.hasOwnProperty('changed') ) {
							arrAdded['values'].push({
								'status_name' : 'changed',
								'status_value' : ( _id['changed'] === 1 ? 'YES' : 'NO' )
							})
						}

						arrAdded['count'] = count

						cleanCounts[status].push(arrAdded)

					}
				}

				outputArr[catalog_slug] = cleanCounts
			}
			

			return res.send(outputArr)

		} catch (error) {
			res.status(400)
			return res.end(error.message)
		}
	}

	async storeCatalog(req, res, next){
		
		try {
			let title = req.body.title
			let url = req.body.url

			let catalog = await this.catalogRepository.storeCatalog(title, url)

			return res.send(catalog)

		} catch (error) {
			res.status(400)
			return res.end(error.message)
		}

	}

	async addScraperConfig(req, res, next){
		
		try {
			let selectedScraper = req.body.scraper
			let selectedCatalog = req.body.catalog
			let scraper_links = req.body.scraper_links

			let catalog = await this.catalogRepository.addScraperConfig(selectedScraper, selectedCatalog, scraper_links)

			return res.send(catalog)

		} catch (error) {
			res.status(400)
			return res.end(error.message)
		}

	}


}