import ProductSchema from '../schemas/Product.js'
import mongoosePaginate from 'mongoose-paginate-v2'

import { MongoDatabase } from '../index.js'

ProductSchema.plugin(mongoosePaginate);
ProductSchema.index({ title: 'text', description: 'text', brand: 'text' });

let ProductModel = MongoDatabase('product', ProductSchema)

const ProductModelCollection = async function(catalog_name){
	return MongoDatabase('product', ProductSchema, catalog_name)
}

export {
	ProductModel,
	ProductModelCollection
}