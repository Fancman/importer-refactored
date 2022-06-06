const GoogleSchema = require('../schemas/Google')

const { getMongoModel } = require('../index')

let GoogleModel = getMongoModel('google_product', GoogleSchema)

const GoogleModelCollection = async function(catalog_name){
	return getMongoModel('google_product', GoogleSchema, catalog_name)
}

module.exports = {
	GoogleModel,
	GoogleModelCollection
}