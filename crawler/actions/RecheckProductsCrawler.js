import EventsObserver from "../../database/Observer.js"

export default class RecheckProductsCrawler {

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

		await this.recheckProducts(parsePageFnc, cleanParsedData, checkDataFnc)
		
		this._running = false

		return
	}

	async stop(){
		this._running = false
	}

	async compareProductsData(oldData, newData) {
		let changed = false

		for (const [key, value] of Object.entries( newData ) ) {

			if ( !['errors', 'fieldErrors'].includes(key) ) {
				continue;
			}
			
			if ( key.includes('.') && Array.isArray(value) ) {
				let segments = key.split('.')
				let oldDataTemp = oldData

				for ( let segment of segments ) {
					oldDataTemp = oldDataTemp[segment]
				}

				if (oldDataTemp.length !== value.length){
					changed = true
					break;
				}

				for ( let arrAttr of value ) {
					if ( !oldDataTemp.includes(arrAttr) ) {
						changed = true
						break;
					}
				}
			} else {
				if ( newData[key] !== value ) {
					changed = true
					break;
				}
			}
		}

		return changed
		  
	}

	async recheckProducts( parsePageFnc, cleanParsedData, checkDataFnc ) {
		let totalProductsCount = this._data.products.length
		let recheckedProductsCount = 0

		for (let product of this._data.products) {	

			let url = product.url
			let id = product.id
	
			console.log(`[${recheckedProductsCount}/${totalProductsCount}] Started rechecking: ^${url}^:`);
			
			try {
				if (this._tab) {

					if ( this._running === false ){
						break
					}

					let result = await this.inspectPage(parsePageFnc, url)

					if ( typeof result.response === 'undefined' ) {
						this._running = false
						break
					}

					result = await cleanParsedData( result )

					let checkResponseDataResult = await checkDataFnc( result )

					if ( checkResponseDataResult === 1 ) {
						let comparisonRes = await this.compareProductsData(product, result.response)
						
						if ( comparisonRes === true ) {
							EventsObserver.emit('update_product_data', {
								scraper_name: this._data.scraper_name,
								url: url,
								id: id,
								response: result.response,
								catalog_slug: this._data.catalog_slug,
							});
						} else {
							 	EventsObserver.emit('rechecked_product_data', {
								scraper_name: this._data.scraper_name,
								url: url,
								id: id,
								response: result.response,
								catalog_slug: this._data.catalog_slug,
							});
						}
						
					} else {
						console.log( 'Something wrong happend' )
						EventsObserver.emit('deactivate_rechecked_product', {
							scraper_name: this._data.scraper_name,
							url: url,
							id: id,
							response: result.response,
							catalog_slug: this._data.catalog_slug,
						});
					}

					recheckedProductsCount++					
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

			urlObject.code = await response.status()

			urlObject.response = await evaluateFnc(this._tab)

		} catch (error) {

			urlObject.error = error	

		} finally {
			return urlObject
		}
	}
	
}