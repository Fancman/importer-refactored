import Route from './_index.js'

import CrawlerBuilder from '../../crawler/CrawlerBuilder.js'

import ProductRepositoryFascade from "../../database/repositories/Product.js"
import CatalogRepositoryFascade from "../../database/repositories/Catalog.js"

export default class ScraperRoute extends Route {

	_startegymanager
	_crawlermanager

	constructor (startegyManager, crawlerManager) {
		super()

		this._startegymanager = null
		this._crawlermanager = null

		this.productRepository = new ProductRepositoryFascade()
		this.catalogRepository = new CatalogRepositoryFascade()

		this._startegymanager = startegyManager
		this._crawlermanager = crawlerManager
	}

	indexRoutes(){
		this._router.get('/scrapers', async (req, res, next) => {
			this.getScrapers(req, res, next)
		})

		this._router.post('/scrape-links', async (req, res, next) => {
			this.scrapePagination(req, res, next)
		})

		this._router.post('/stop-scrape-links', async (req, res, next) => {
			this.stopScrapePagination(req, res, next)
		})

		this._router.post('/stop-scrape-products', async (req, res, next) => {
			this.stopScrapeProducts(req, res, next)
		})

		this._router.post('/scrape-products', async (req, res, next) => {
			this.scrapeProducts(req, res, next)
		})

		this._router.post('/recheck-products', async (req, res, next) => {
			this.recheckProducts(req, res, next)
		})

		this._router.post('/scrapers-counts', async (req, res, next) => {
			this.getScrapersCounts(req, res, next)
		})

		this._router.post('/mw-counts', async (req, res, next) => {
			this.getMWCounts(req, res, next)
		})
	}

	async getMWCounts(req, res, next) {
		try {
			let catalog_slug = req.body.catalog.slug

			let counts = await this.productRepository.findMWCounts(catalog_slug)

			return res.send(counts)
		} 
		catch (error) {
			res.status(404)
			return res.end(error.message)
		}

	}

	async getScrapersCounts(req, res, next) {
		try {
			let catalog_slug = req.body.catalog.slug

			let counts = await this.productRepository.findScrapersCounts(catalog_slug)

			return res.send(counts)
		} 
		catch (error) {
			res.status(404)
			return res.end(error.message)
		}

	}

	async recheckProducts(req, res, next) {
		try {
			let ACTION = 'recheckProducts'

			let catalog_slug = req.body.catalog.slug
			let scraper_name = req.body.scraper.name
			
			let products = await this.productRepository.getProductsWithStatus(catalog_slug, {
				scraper_name: scraper_name,
				status: 'scraped'
			})

			let data = {
				action: ACTION,
				catalog_slug: catalog_slug,
				products: products,
				scraper_name: scraper_name
			}

			let crawlerBuilderInstance = new CrawlerBuilder(this._startegymanager, this._crawlermanager, data)

			await crawlerBuilderInstance.init()

			this._crawlermanager.startAction(scraper_name, ACTION)

			return res.send('Crawling started')

		} catch (error) {
			res.status(404)
			return res.end(error.message)
		}
	}

	async scrapePagination(req, res, next) {
		try {
			let ACTION = 'crawlPaginationAndCollectLinks'

			let catalog_slug = req.body.catalog.slug
			let scraper_name = req.body.scraper.name
			let scraper_links = req.body.scraper.links

			let data = {
				action: ACTION,
				catalog_slug: catalog_slug,
				scraper_links: scraper_links,
				scraper_name: scraper_name
			}

			let crawlerBuilderInstance = new CrawlerBuilder(this._startegymanager, this._crawlermanager, data)

			await crawlerBuilderInstance.init()

			this._crawlermanager.startAction(scraper_name, ACTION)

			return res.send('Crawling started')

		} catch (error) {
			res.status(404)
			return res.end(error.message)
		}
	}

	async scrapeProducts(req, res, next) {
		try {
			let ACTION = 'inspectLinksAndStoreData'

			let catalog_slug = req.body.catalog.slug
			let scraper_name = req.body.scraper.name
			
			let product_links = await this.productRepository.getProductsWithStatus(catalog_slug, {
				scraper_name: scraper_name,
				status: 'none'
			})

			let data = {
				action: ACTION,
				catalog_slug: catalog_slug,
				product_links: product_links,
				scraper_name: scraper_name
			}

			let crawlerBuilderInstance = new CrawlerBuilder(this._startegymanager, this._crawlermanager, data)

			await crawlerBuilderInstance.init()

			this._crawlermanager.startAction(scraper_name, ACTION)

			return res.send('Crawling started')

		} catch (error) {
			res.status(404)
			return res.end(error.message)
		}
	}

	async stopScrapePagination(req, res, next) {
		try {
			let ACTION = 'crawlPaginationAndCollectLinks'
			let scraper_name = req.body.scraper.name

			this._crawlermanager.stopAction(scraper_name, ACTION)

			return res.send('Stopping crawling')

		} catch (error) {
			res.status(404)
			return res.end(error.message)
		}
	}

	async stopScrapeProducts(req, res, next) {
		try {
			let ACTION = 'inspectLinksAndStoreData'
			let scraper_name = req.body.scraper.name

			this._crawlermanager.stopAction(scraper_name, ACTION)

			return res.send('Stopping crawling')

		} catch (error) {
			res.status(404)
			return res.end(error.message)
		}
	}

	async getScrapers(req, res, next) {
		try {
			let scrapers = await this._startegymanager.getStrategiesNames()
			res.send(scrapers)
		} catch (error) {
			res.status(404)
			return res.send({ error: error })
		}
	}
}