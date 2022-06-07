import ShopRoute from "./routes/ShopRoute.js"
import CrawlerRoute from "./routes/CrawlerRoute.js"
import CatalogRoute from "./routes/CatalogRoute.js"

export default class Router {

	_app = null
	_startegymanager = null

	constructor (app, startegyManager) {		
		this._app = app
		this._startegymanager = startegyManager
	}

	addRoutes() {
		let shopRouter = new ShopRoute().getRouter()
		let crawlerRouter = new CrawlerRoute(this._startegymanager).getRouter()
		let catalogRouter = new CatalogRoute().getRouter()

		this._app.use('/api/shops', shopRouter)
		this._app.use('/api/crawler', crawlerRouter)
		this._app.use('/api/catalogs', catalogRouter)
	}

}