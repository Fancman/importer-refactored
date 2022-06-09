import slugify from 'slugify';

import CatalogSchema from '../schemas/Catalog.js'

import { MongoDatabase } from '../index.js'

CatalogSchema.pre('save', async function(next) {
	this.slug = slugify(this.title)
	next();
});

let CatalogModel = MongoDatabase('catalog', CatalogSchema)

const CatalogModelCollection = async function(catalog_name){
	return MongoDatabase('catalog', CatalogSchema, catalog_name)
}

export {
	CatalogModel,
	CatalogModelCollection
}