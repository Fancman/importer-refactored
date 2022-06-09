import GoogleSchema from '../schemas/Google.js'

import { MongoDatabase } from '../index.js'

let GoogleModel = MongoDatabase('google_product', GoogleSchema)

const GoogleModelCollection = async function(catalog_name){
	return MongoDatabase('google_product', GoogleSchema, catalog_name)
}

export {
	GoogleModel,
	GoogleModelCollection
}