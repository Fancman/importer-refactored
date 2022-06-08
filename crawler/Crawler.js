import StrategyManager from "./StrategyManager.js"
import RellecigaDomainStrategy from "./strategies/RellecigaDomainStrategy.js"

export default class Crawler {

	_tab = null

	_data = {}
	_strategy = null

	async startAction(tab) {
		if( this.action === 'getLinksAndPagination' ){

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
}

/*class StrategyCrawler {

	constructor(strategy, domainName, action) {
		this.action = action
		this.domainName = domainName
		this.strategy = strategy
	}

	visit(crawler) {
		crawler.setStrategy(this.strategy)
		crawler.setAction(this.action)
		crawler.setDomainName(this.domainName)
	}
}

class CrawlerManager {

	_crawlers = []

	constructor(){		
		this.browser = null
	}

	async startAction(domainName, action){
		let crawler = this.getCrawler(domainName, action)

		if( crawler === undefined ){
			return null
		}

		this.setBrowser()

		let tab = this.getPage()
		

		if(crawler){
			crawler.startAction(tab)
		}
	}

	async stopAction(domainName, action){
		let crawler = this.getCrawler(domainName, action)

		if(crawler) {
			crawler.stopAction()
		}
	}

	addCrawler(crawler) {
		if( this.getCrawler(crawler.domainName, crawler.action) ){
			return null
		}

		this._crawlers = [ ...this._crawlers, crawler ]

		return crawler
	}

	getCrawler(domainName, action) {
		return this._crawlers.find(crawler => crawler.domainName === domainName && crawler.action === action )
	}

	async getPage(){
		return await this.browser.newPage();
	}
	  
	async releasePage(page){
		if(page && !page.isClosed()){
			await page.close();	  
		}
	}

	async setBrowser(){
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

	let domainName = 'relleciga.sk'
	let catalogName = 'ludora.sk'

	let strategyManager = new StrategyManager();
	let crawlerManager = new CrawlerManager();

	strategyManager.addStrategy(new RellecigaDomainStrategy())

	/////////////////////////////////////////////////////////

	let crawler = new Crawler();

	let strategy = strategyManager.getStrategy('relleciga.sk')

	if(strategy === null || strategy === undefined){
		console.log("Strategia pre domenu neexistuje")
		return
	}

	let strategyCrawler = new StrategyCrawler(strategy, 'relleciga.sk', 'getLinksAndPagination')

	crawler.accept(strategyCrawler)

	if( await crawlerManager.addCrawler(crawler) === null ){
		console.log("Crawler pre domenu a akciu uz bezi")
		return
	}

	let crawlerManagerObj = await crawlerManager.getCrawler('relleciga.sk', 'getLinksAndPagination')

	if( crawlerManagerObj === undefined ){
		console.log("Crawler pre domenu a akciu nebol vytvoreny")
		return
	}

	crawlerManager.startAction('relleciga.sk', 'getLinksAndPagination')

})();
*/