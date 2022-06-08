import puppeteer from 'puppeteer'

export default class CrawlerManager {

	_crawlers = []

	constructor(){		
		this.browser = null
	}

	async startAndGetTab(){
		await this.setBrowser()

		let tab = await this.getPage()
		
		return tab
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
		return new Promise(async (resolve) => {
			try {
				let browser = await puppeteer.launch({
					headless: true,
					args: [
						'--no-sandbox'
					]
				});
				return resolve(browser)
			} catch (error) {
				return resolve(null)
			}
		})
	}

	async releaseBrowser(){
		if(this.browser){
			await this.browser.close();
		}
	}

}