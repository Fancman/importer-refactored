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


		// Ked sa scrapne a priradi kategoria tak sa uploadne na frontend
		this.on('save_link_data', async (data) => {
			//console.log("save_link_data event")	
			this.productRepositoryFascade.storeProduct(data)
		})

		// Ked sa scrapne a priradi kategoria tak sa uploadne na frontend
		this.on('update_product_data', async (data) => {
			//console.log("save_link_data event")	
			this.productRepositoryFascade.updateProduct(
				data,
				{
					status: 'rechecked',
					active: 1,
					changed: 1
				}
			)
		})

		this.on('rechecked_product_data', async (data) => {
			//console.log("save_link_data event")	
			this.productRepositoryFascade.updateProduct(
				data,
				{
					status: 'rechecked',
					active: 1,
					changed: 0
				}
			)
		})

		// Ked sa deaktivuje produkt lokalne tak sa deaktivuje aj na frontende
		this.on('deactivate_product', async (data) => {
			//console.log("deactivate_product event")	
			this.productRepositoryFascade.updateProduct(
				data,
				{
					status: 'scraped',
					active: 0,
					changed: 1
				}
			)
		})

		// Ked sa deaktivuje produkt lokalne tak sa deaktivuje aj na frontende
		this.on('deactivate_rechecked_product', async (data) => {
			//console.log("deactivate_product event")	
			this.productRepositoryFascade.updateProduct(
				data,
				{
					status: 'rechecked',
					active: 0,
					changed: 1
				}
			)
		})

		// Compress file and resize
		this.on('save_image', async (data) => {
			this.productRepositoryFascade.saveImage(data)
		})
		
	}
}

export default new EventsObserver()