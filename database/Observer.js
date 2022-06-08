//const EventEmitter = require('events').EventEmitter

import { EventEmitter } from 'events'

class MyService extends EventEmitter {
	constructor() {
		super()

		this.init()
	}

	init(){
		this.on('save_product_links', async (data) => {
			console.log("save_product_links")			
		})

		this.on('save_link_data', async (data) => {
			console.log("save_link_data")			
		})
	}
}

export default new MyService()