const HeurekaSchema = require('../schemas/Heureka')

const { getMongoModel } = require('../index')

let HeurekaModel = getMongoModel('heureka_product', HeurekaSchema)

const HeurekaModelCollection = async function(catalog_name){
	return getMongoModel('heureka_product', HeurekaSchema, catalog_name)
}

module.exports = {
	HeurekaModel,
	HeurekaModelCollection
}