import slugify from 'slugify';

import CatalogSchema from '../schemas/Catalog.js'

import { getMongoModel } from '../index.js'

CatalogSchema.pre('save', async function(next) {
	this.slug = slugify(this.title)
	next();
});

let CatalogModel = getMongoModel('catalog', CatalogSchema)

const CatalogModelCollection = async function(catalog_name){
	return getMongoModel('catalog', CatalogSchema, catalog_name)
}

export {
	CatalogModel,
	CatalogModelCollection
}