import EventsObserver from "../../database/Observer.js"

export default class LinksInspectorCrawler {

	_running = false

	constructor(strategy, data, tab){
		this._data = data
		this._strategy = strategy
		this._tab = tab
	}

	async start(){
		let fnc = this._strategy.parsePage

		this._running = true

		await this.crawlPages(fnc)
		
		this._running = false

		return
	}

	async stop(){
		this._running = false
	}


	async crawlPages( evaluateFnc ) {
		for (let product of this._data.product_links) {	

			let url = product.url
			let id = product.id
	
			console.log(`Started inspecting: ^${url}^:`);
			
			try {
				if (this._tab) {

					if ( this._running === false ){
						break
					}

					let result = await this.inspectPage(evaluateFnc, url)

					EventsObserver.emit('save_link_data', {
						scraper_name: this._data.scraper_name,
						url: url,
						id: id,
						response: result.response,
						catalog_slug: this._data.catalog_slug,
					});
				}
			} catch (error) {
				console.log(error)
				break
			}
		}
	}

	async inspectPage(evaluateFnc, url){
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