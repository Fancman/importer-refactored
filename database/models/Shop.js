import slugify from 'slugify';

import ShopSchema from '../schemas/Shop.js'

import { MongoDatabase } from '../index.js'

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

let ShopModel = MongoDatabase('shop', ShopSchema)

export {
	ShopModel
}