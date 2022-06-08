import Utils from "../../utils/index.js"

export default class PaginationCrawler {

	constructor(strategy, links, tab){
		this._links = links
		this._strategy = strategy
		this._tab = tab
	}

	async start(){
		let fnc = this._strategy.getLinksAndPagination

		for (let url of this._links) {
			await this.crawlPagination(url, fnc)	
		}

		return
	}

	async crawlPagination( starter_url, evaluateFnc ) {
		let paginationLinks = [ starter_url ]
		let visitedPaginationLinks = []
		let utils = Utils

		while( paginationLinks.length > 0 ){		

			if(this._tab){

				let firstUrl = paginationLinks[0]
				let result = await this.inspectPagination(evaluateFnc, firstUrl)
				let randomInt = utils.getRandomInt(1500, 5000)

				await utils.sleep(randomInt)
				
				paginationLinks.shift()
				visitedPaginationLinks.push(firstUrl)
		
				if(result.error === null){

					let links = result.response.links
					let paginations = result.response.paginations

					/*eventEmitter.emit('save_links', {
						scraper_name: scraper_name,
						links: links,
						catalog_slug: catalog_slug,
					});*/

					for(const pagination_link of paginations){
						if( ! visitedPaginationLinks.includes(pagination_link)){
							if(! paginationLinks.includes(pagination_link)){
								paginationLinks.push(pagination_link)
							}
						}
					}

				}
				
			}

		}
	//await page.setUserAgent(userAgent.toString())

	//await this._strategy.getLinksAndPagination(link)
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