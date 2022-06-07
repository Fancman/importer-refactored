import Route from './_index.js'

export default class CrawlerRoute extends Route {

	_startegymanager = null

	constructor (startegyManager) {
		super()

		this._startegymanager = startegyManager
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
}