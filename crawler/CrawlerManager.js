export default class CrawlerManager {

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
		return this._crawlers.find(crawler => crawler._data.scraper_name === domainName && crawler._data.action === action )
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