import { EventEmitter } from 'events'

import ProductRepositoryFascade from './repositories/Product.js'

class EventsObserver extends EventEmitter {

	_data
	
	constructor() {
		super()

		this._data = {}

		this.productRepositoryFascade = new ProductRepositoryFascade()

		this.init()
	}

	init(){
		this.on('save_product_links', async (data) => {
			//console.log("save_product_links event")
			this.productRepositoryFascade.storeLinks(data)	
		})

		this.on('save_link_data', async (data) => {
			//console.log("save_link_data event")	
			this.productRepositoryFascade.storeProduct(data)
		})

		this.on('deactivate_product', async (data) => {
			//console.log("deactivate_product event")	
			this.productRepositoryFascade.storeProduct(data)
		})

		this.on('save_image', async (data) => {
			this.productRepositoryFascade.saveImage(data)
		})
		
	}
}

export default new EventsObserver()