import EventsObserver from "../../database/Observer.js"

export default class LinksInspectorCrawler {

	_running = false

	constructor(strategy, data, tab){
		this._data = data
		this._strategy = strategy
		this._tab = tab
	}

	async start(){
		let parsePageFnc = this._strategy.parsePage
		let cleanParsedData = this._strategy.cleanParsedData
		let checkDataFnc = this._strategy.checkData

		this._running = true

		await this.crawlPages(parsePageFnc, cleanParsedData, checkDataFnc)
		
		this._running = false

		return
	}

	async stop(){
		this._running = false
	}


	async crawlPages( parsePageFnc, cleanParsedData, checkDataFnc ) {
		for (let product of this._data.product_links) {	

			let url = product.url
			let id = product.id
	
			console.log(`Started inspecting: ^${url}^:`);
			
			try {
				if (this._tab) {

					if ( this._running === false ){
						break
					}

					let result = await this.inspectPage(parsePageFnc, url)

					result = await cleanParsedData( result )

					let checkResponseDataResult = await checkDataFnc( result )

					if ( checkResponseDataResult === 1 ) {
						EventsObserver.emit('save_link_data', {
							scraper_name: this._data.scraper_name,
							url: url,
							id: id,
							response: result.response,
							catalog_slug: this._data.catalog_slug,
						});
					} else {
						console.log( 'Something wrong happend' )
					}

					
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
			code: null,
		}
	
		try {

			await this._tab.setRequestInterception(true)

			const [response] = await Promise.all([
				this._tab.waitForResponse(res => res.url() === url, {timeout: 90000}),
				this._tab.goto(url, { waitUntil: 'networkidle2' })
			]);

			/*console.log(await res.json());

			await this._tab.goto(url, { waitUntil: 'networkidle2' })

			let response = await this._tab.waitForResponse(response => response)*/

			urlObject.code = await response.status()

			urlObject.response = await evaluateFnc(this._tab)

		} catch (error) {

			urlObject.error = error	

		} finally {
			return urlObject
		}
	}
	
}