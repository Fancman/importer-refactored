const slugify = require('slugify')

const ShopSchema = require('../schemas/Shop')

const { getMongoModel } = require('../index')

ShopSchema.pre('save', async function(next) {
	this.slug = slugify(this.title)

	if( this.sources != undefined && this.sources.length > 0 ){

		if( this.sources.length ) {
			this.sources.forEach((source, index) => {
				let source_type = source.source_type
				let collection_name = `products_${source_type.toLowerCase()}_${this.slug}`

				this.sources[index].source_collection = collection_name
			})
		}
	} 

	next();
});

let ShopModel = getMongoModel('shop', ShopSchema)

module.exports = {
	ShopModel
}