import HeurekaSchema from '../schemas/Heureka.js'

import { MongoDatabase } from '../index.js'

let HeurekaModel = MongoDatabase('heureka_product', HeurekaSchema)

const HeurekaModelCollection = async function(catalog_name){
	return MongoDatabase('heureka_product', HeurekaSchema, catalog_name)
}

export {
	HeurekaModel,
	HeurekaModelCollection
}