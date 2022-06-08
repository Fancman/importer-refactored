export default class StrategyCrawler {

	_data = {}
	_strategy = null

	constructor(strategy, data) {
		this._data = data
		this._strategy = strategy
	}

	visit(crawler) {
		crawler.setStrategy(this._strategy)
		crawler.setData(this._data)
	}
}