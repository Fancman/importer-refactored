import Route from './_index.js'

import ShopRepositoryFascade from "../../database/repositories/Shop.js"
import ProductRepositoryFascade from "../../database/repositories/Product.js"

import Utils from '../../utils/index.js'

import slugify from 'slugify'

import fieldsXML from '../../utils/fields.js'

export default class ProductRoute extends Route {

	constructor () {
		super()

		this.shopRepository = new ShopRepositoryFascade()
		this.productRepository = new ProductRepositoryFascade()
	}

	indexRoutes(){
		this._router.post('/update-category', async (req, res, next) => {
			this.updateCategory(req, res, next)
		})

		this._router.post('/search', async (req, res, next) => {
			this.search(req, res, next)
		})

		this._router.post('/paginate', async (req, res, next) => {
			this.paginate(req, res, next)
		})

		this._router.post('/create-products', async (req, res, next) => {
			this.createProducts(req, res, next)
		})
		
	}

	async createProducts(req, res, next)
	{
		try {
			let catalog_slug = req.body.catalog.slug
			let scraper_names = req.body.selectedScrapers

			let products = await this.productRepository.createProducts(
				catalog_slug,
				scraper_names
			)

			return res.send(products)
			
		} catch (error) {
			res.status(400)
			return res.end(error.message)
		}

	}

	async paginate(req, res, next)
	{
		try {
			let catalog_slug = req.body.catalog

			let products = await this.productRepository.paginate(
				catalog_slug,
				{ status: 'scraped' },
				{ page: 1, limit: 100 }
			)

			return res.send(products)
			
		} catch (error) {
			res.status(400)
			return res.end(error.message)
		}

	}

	async updateCategory(req, res, next)
	{
		try {
			let catalog_slug = req.body.catalog
			let products_ids = req.body.ids
			let category = req.body.category

			let products = await this.productRepository.updateProductsCategory(
				catalog_slug,
				products_ids,
				category
			)

			return res.send(products)
			
		} catch (error) {
			res.status(400)
			return res.end(error.message)
		}

	}

	async search(req, res, next)
	{
		try {
			let catalog_slug = req.body.catalog
			let input = req.body.searchInput
			let category = req.body.category
			let scraper_name = req.body.scraperName
			let status = req.body.statusFilter
			let hasMW = req.body.hasMW

			let products = await this.productRepository.search(
				catalog_slug,
				input,
				category,
				status,
				scraper_name,
				hasMW
			)

			return res.send(products)
			
		} catch (error) {
			res.status(400)
			return res.end(error.message)
		}

	}

}