import puppeteer from 'puppeteer-extra'

import StealthPlugin from 'puppeteer-extra-plugin-stealth'

import AdblockerPlugin from 'puppeteer-extra-plugin-adblocker'


puppeteer.use(StealthPlugin())
puppeteer.use(AdblockerPlugin({ blockTrackers: true }))


export default class CrawlerManager {

	_crawlers = []
	_browser = null

	constructor(){		
		this._browser = null
	}

	async startAndGetTab(){
		await this.setBrowser()

		let tab = await this.getPage()
		
		return tab
	}

	async startAction(domainName, action){
		let crawler = this.getCrawler(domainName, action)		

		if(crawler) {
			await crawler.start()
			await this.removeCrawler(crawler)
		}
	}

	async stopAction(domainName, action){
		let crawler = this.getCrawler(domainName, action)

		if(crawler) {
			crawler.stop()
		}
	}

	addCrawler(crawler) {
		if( this.getCrawler(crawler.domainName, crawler.action) ){
			return null
		}

		this._crawlers = [ ...this._crawlers, crawler ]

		return crawler
	}

	async removeCrawler(crawler) {
		for( var i = 0; i < this._crawlers.length; i++){ 
    
			if ( this._crawlers[i].hasOwnProperty('_data') ) { 
		
				if( this._crawlers[i]._data.scraper_name === crawler._data.scraper_name 
					&&
					this._crawlers[i]._data.action === crawler._data.action
				) {
					await this.releasePage(this._crawlers[i]._tab)

					console.log('Closed: ', this._crawlers[i]._tab.isClosed())

					this._crawlers[i]._tab = null
					
					this._crawlers.splice(i, 1); 
					
					await this.releaseBrowserNoneCrawlers()

					console.log(`Crawler stopped: ${crawler._data.scraper_name} ${crawler._data.action}`)
				}
				
			}
		
		}
	}

	getCrawler(domainName, action) {
		return this._crawlers.find(crawler => crawler._data.scraper_name === domainName && crawler._data.action === action )
	}

	async getPage(){
		let tab = await this._browser.newPage();

		return tab
	}
	  
	async releasePage(page){
		if(page && !page.isClosed()){
			await page.close();	  
		}
	}

	async setBrowser(){
		if(this._browser === null){
			this._browser = await this.startBrowser()
		}
		
		return this._browser
	}

	async startBrowser(){
		return new Promise(async (resolve) => {
			try {
				
				let browser = await puppeteer.launch({
					headless: false,
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

	async releaseBrowserNoneCrawlers(){
		if( this._crawlers.length === 0 ){
			await this.releaseBrowser();
		}
	}

	async releaseBrowser(){
		if( this._browser ){
			await this._browser.close();
			this._browser = null
		}
	}

}