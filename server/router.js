const ShopRoute = require('./routes/ShopRoute')

module.exports = class Router {

	_app = null

	constructor (app) {		
		this._app = app
	}


	addRoutes() {
		let shopRouter = new ShopRoute().getRouter()

		this._app.use('/api/shops', shopRouter)
	}

}