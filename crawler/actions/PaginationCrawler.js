import Utils from "../../utils/index.js"

import EventsObserver from "../../database/Observer.js"

export default class PaginationCrawler {

	_running = false

	constructor(strategy, data, tab){
		this._data = data
		this._strategy = strategy
		this._tab = tab
	}

	async start(){
		let fnc = this._strategy.getLinksAndPagination

		this._running = true

		for (let url of this._data.scraper_links) {
			await this.crawlPagination(url, fnc)	
		}
		
		this._running = false

		return
	}

	async stop(){
		this._running = false
	}

	async crawlPagination( starter_url, evaluateFnc ) {
		let paginationLinks = [ starter_url ]
		let visitedPaginationLinks = []
		let utils = Utils

		while( paginationLinks.length > 0 ){		

			if(this._tab){

				if ( this._running === false ){
					break
				}

				let firstUrl = paginationLinks[0]

				console.log(`Inspcting pagination url: ${firstUrl}`)

				let result = await this.inspectPagination(evaluateFnc, firstUrl)
				let randomInt = utils.getRandomInt(1500, 10000)

				await utils.sleep(randomInt)
				
				paginationLinks.shift()
				visitedPaginationLinks.push(firstUrl)
		
				if(result.error === null){

					let links = result.response.links
					let paginations = result.response.paginations

					EventsObserver.emit('save_product_links', {
						scraper_name: this._data.scraper_name,
						links: links,
						catalog_slug: this._data.catalog_slug,
					})

					for (const pagination_link of paginations){
						if( ! visitedPaginationLinks.includes(pagination_link)){
							if(! paginationLinks.includes(pagination_link)){
								paginationLinks.push(pagination_link)
							}
						}
					}

				} else {
					console.log(result.error)
				}
				
			}

		}
	}

	async inspectPagination(evaluateFnc, url){	

		let urlObject = {
			response: null,
			error: null,
		}
	
		try {
			const response = await this._tab.goto(url, { waitUntil: 'networkidle2' })
			urlObject.response = await evaluateFnc(this._tab)
		} catch (error) {
			urlObject.error = error			
		} finally {
			return urlObject
		}
	}
}