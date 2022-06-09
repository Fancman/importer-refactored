import checkCrawlerActions from "./actions/index.js"
import ActionBuilder from "./actions/ActionBuilder.js"

export default class Crawler {

	_tab = null

	_data = {}
	_strategy = null
	_actioncrawler = null

	async start() {
		let actionName = await checkCrawlerActions(this._data)

		this._actioncrawler = await ActionBuilder(this._strategy, this._data, this._tab, actionName)

		if( this._actioncrawler ){
			await this._actioncrawler.start()			
		}
	}

	async stop() {
		if( this._actioncrawler ) {
			this._actioncrawler.stop()
		}
	}

	accept(visitor) {
		visitor.visit(this)
	}

	setStrategy(strategy){
		this._strategy = strategy
	}

	setData(data){
		this._data = data
	}

	getStrategy(){
		return this._strategy
	}

	setTab(tab){
		this._tab = tab
	}
}