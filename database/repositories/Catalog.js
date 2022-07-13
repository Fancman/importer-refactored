import { CatalogModel } from '../models/Catalog.js'

export default class CatalogRepositoryFascade {

	async findOneCatalog(query)
	{
		try {
			let model = await CatalogModel
			let catalog = await model.findOne(query).exec()
			return catalog
		} 
		catch (error) {
			return null
		}
	}

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
		return new Promise( (resolve, reject) => {
			try {
				Model.findOneAndUpdate({_id: id}, {$push: {scrapers: body} }, {
					returnOriginal: false, 'upsert': true
				}).then( (doc) => {
					return resolve(doc)
				})
			} catch (error) {
				return reject(error)
			}
		})
	}


	async getCatalogStatusesCount(Model){
		return new Promise( async (resolve, reject) => {
			try {
				let counts = await Model.aggregate([
					{
						$group: 
						{
								_id: {
									status: "$status",
									active: "$active",
									changed: '$changed'
								},
								count: { $sum: 1 }
						}
					}
				])
	
				return resolve(counts)
				
			} catch (error) {
				return reject(error)
			}
		})
	}

}