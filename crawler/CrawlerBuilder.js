import StrategyCrawler from "./StrategyCrawler.js"
import Crawler from './Crawler.js'

export default class CrawlerBuilder {

	_action = null
	_scraperdomain = null
	_strategy = null
	_crawler = null
	
	constructor(strategyManager, crawlerManager, data) {
		this._crawler = new Crawler();

		this.setAction(data)
		this.setScraperDomain(data)
		this.setCrawlerStrategy(strategyManager)
		this.createStrategyCrawler(data)
		this.addCrawlerToCrawlerManager(crawlerManager)
		this.checkCrawlerInCrawlerManager(crawlerManager)

		return this._crawler
	}

	setAction(data){
		this._action = data.action
	}

	setScraperDomain(data){
		this._scraperdomain = data.scraper_name
	}

	setCrawlerStrategy(strategyManager){
		let strategy = strategyManager.getStrategy(this._scraperdomain)

		if( strategy === null || strategy === undefined ){
			throw new Error("Strategia pre domenu neexistuje")
		}

		this._strategy = strategy
	}

	createStrategyCrawler(data){
		let strategyCrawler = new StrategyCrawler(this._strategy, data)

		this._crawler.accept(strategyCrawler)
	}

	async addCrawlerToCrawlerManager(crawlerManager){
		if( await crawlerManager.addCrawler(this._crawler) === null ){
			throw new Error("Crawler pre domenu a akciu uz bezi")
		}
	}

	async checkCrawlerInCrawlerManager(crawlerManager){
		let crawlerManagerObj = await crawlerManager.getCrawler(this._scraperdomain, this._action)

		if( crawlerManagerObj === undefined ){
			throw new Error("Crawler pre domenu a akciu nebol vytvoreny")
		}
	}
}