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

	async addScraperConfig(selectedScraper, selectedCatalog, scraper_links)
	{
		try {
			let body = {
				name: selectedScraper,
				links: scraper_links
			}

			let model = await CatalogModel

			let catalog = await this.findOneAndUpdateScrapers(model, selectedCatalog, body)

			return catalog
		} 
		catch (error) {
			return null
		}
	}

	async findOneAndUpdateScrapers(Model, id, body) {
		return new Promise(async (resolve, reject) => {
			try {
				let doc = Model.findOneAndUpdate({_id: id}, {$push: {scrapers: body} }, {
					returnOriginal: false, 'upsert': true
				})
				return resolve(doc)
			} catch (error) {
				return reject(error)
			}
		})
	}

	

}