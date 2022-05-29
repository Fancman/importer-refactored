'use strict';

class StrategyManager {
	
	constructor() {
		this._strategies = []
	}

	addStrategy(strategy) {
		this._strategies = [ ...this._strategies, strategy ]
	}

	getStrategy(name) {
		return this._strategies.find(strategy => strategy.name === name)
	}

}


class DomainStrategy {
	constructor(){}

	getLinksAndPagination(){}

	parsePage(){}
}

class RellecigaDomainStrategy extends DomainStrategy {
	name = 'relleciga.sk'

	constructor(){
		super()
	}

	log(){
		console.log("TEST")
	}
}

class Crawler {
	
	constructor(){
		
		this.strategyManager = null
		this.browser = null
		this.tabs = {}		

		this.init()
	}


	init(){
		this.strategyManager = new StrategyManager()
		this.strategyManager.addStrategy(new RellecigaDomainStrategy())
	}

	startInspectingPages(domainName){
		let domainStrategy = this.strategyManager.getStrategy(domainName)

		if(domainStrategy === undefined){
			throw new Error(`Strategy with this name does not exist`);
		}

		domainStrategy.log()
	}

	async getBrowser(){
		if(this.browser === null){
			this.browser = await this.startBrowser()
		}
		
		return this.browser
	}

	async startBrowser(){
		let browser = await puppeteer.launch({
			headless: true,
			args: [
				'--no-sandbox'
			]
		});
	
		return browser
	}

	async releaseBrowser(){
		if(this.browser){
			await this.browser.close();
		}
	}

}

(async () => {
	/*console.log("START")
	let crawler = new Crawler()
	crawler.startInspectingPages('relleciga.sk')*/

	let server = new Server()
	server.start()
})();

