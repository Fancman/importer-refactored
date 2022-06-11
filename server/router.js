import ShopRoute from "./routes/ShopRoute.js"
//import CrawlerRoute from "./routes/CrawlerRoute.js"
import CatalogRoute from "./routes/CatalogRoute.js"
import ScraperRoute from "./routes/ScraperRoute.js"

export default class Router {

	_app
	_startegymanager
	_crawlerManager

	constructor (app, startegyManager,crawlerManager) {		
		this._app = app

		this._startegymanager = startegyManager
		this._crawlerManager = crawlerManager
	}

	addRoutes() {
		let shopRouter = new ShopRoute().getRouter()
		let catalogRouter = new CatalogRoute().getRouter()
		let scraperRouter = new ScraperRoute(this._startegymanager, this._crawlerManager).getRouter()

		this._app.use('/api/shops', shopRouter)
		this._app.use('/api/catalogs', catalogRouter)
		this._app.use('/api/scrapers', scraperRouter)
	}

}