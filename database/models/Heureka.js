import HeurekaSchema from '../schemas/Heureka.js'

import { getMongoModel } from '../index.js'

let HeurekaModel = getMongoModel('heureka_product', HeurekaSchema)

const HeurekaModelCollection = async function(catalog_name){
	return getMongoModel('heureka_product', HeurekaSchema, catalog_name)
}

export {
	HeurekaModel,
	HeurekaModelCollection
}