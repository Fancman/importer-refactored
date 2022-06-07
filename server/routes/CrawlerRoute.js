import express from "express"

export default class CrawlerRoute {

	_router = null
	_startegymanager = null

	constructor (startegyManager) {
		this._router = express.Router()
		this._startegymanager = startegyManager

		this.indexRoutes()
	}

	indexRoutes(){
		this._router.get('/scrapers', async (req, res, next) => {
			this.getScrapers(req, res, next)
		})
	}

	async getScrapers(req, res, next) {
		try {
			let scrapers = await this._startegymanager.getStrategiesNames()
			res.send(scrapers)
		} catch (error) {
			res.status(404)
			res.send({ error: error })
		}
	}

	getRouter() {
		return this._router
	}
}