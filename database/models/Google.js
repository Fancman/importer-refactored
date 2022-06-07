import GoogleSchema from '../schemas/Google.js'

import { getMongoModel } from '../index.js'

let GoogleModel = getMongoModel('google_product', GoogleSchema)

const GoogleModelCollection = async function(catalog_name){
	return getMongoModel('google_product', GoogleSchema, catalog_name)
}

export {
	GoogleModel,
	GoogleModelCollection
}