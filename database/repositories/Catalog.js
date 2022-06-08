import { CatalogModel } from '../models/Catalog.js'

export default class CatalogRepositoryFascade {

	async findCatalogs()
	{
		try {
			let model = await CatalogModel
			let catalogs = await model.find().exec();

			return catalogs
		} 
		catch (error) {
			return null
		}
	}

	async storeCatalog(title, url)
	{
		try {
			let model = await CatalogModel

			let catalog = await model.create({
				'title': title,
				'url': url
			}).exec();

			return catalog
		} 
		catch (error) {
			return null
		}
	}

}