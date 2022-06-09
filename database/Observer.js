import { EventEmitter } from 'events'

import ProductRepositoryFascade from './repositories/Product.js'

class EventsObserver extends EventEmitter {
	constructor() {
		super()

		this.productRepositoryFascade = new ProductRepositoryFascade()
		this.init()
	}

	init(){
		this.on('save_product_links', async (data) => {
			console.log("save_product_links event")
			this.productRepositoryFascade.storeLinks(data)	
		})

		this.on('save_link_data', async (data) => {
			console.log("save_link_data event")	
			this.productRepositoryFascade.storeProduct(data)		
		})
	}
}

export default new EventsObserver()