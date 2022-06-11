import Route from './_index.js'

import ShopRepositoryFascade from "../../database/repositories/Shop.js"

import Utils from '../../utils/index.js'

import slugify from 'slugify'

import fieldsXML from '../../utils/fields.js'

export default class ShopRoute extends Route {

	constructor () {
		super()

		this.shopRepository = new ShopRepositoryFascade()
	}

	indexRoutes(){
		this._router.get('/', async (req, res, next) => {
			this.getShops(req, res, next)
		})

		this._router.get('/:id', async (req, res, next) => {
			this.getShopById(req, res, next)
		})

		this._router.delete('/:id', async (req, res, next) => {
			this.deleteShopById(req, res, next)
		})

		this._router.get('/download_xml/:source_type/:id', async (req, res, next) => {
			this.downloadXML(req, res, next)
		})

		this._router.get('/process/:id/:source_type/:filename', async (req, res, next) => {
			this.processXML(req, res, next)
		})

		this._router.post('/', async (req, res, next) => {
			this.storeShop(req, res, next)
		})
	}

	async storeShop(req, res, next)
	{
		try {
			let source_type = req.body.source.source_type.toLowerCase()
			let source_config = req.body.source.source_config
			let title = req.body.title
		
			let shop = await this.shopRepository.findShopByTitle(title)
	
			if( shop ){
				let sources = shop.sources
				let updated = false
	
				sources.forEach((source, index) => {
					if(source_type === source.source_type){
						sources[index]['source_config'] = source_config
						updated = true
					}
				})
	
				if(!updated){
					sources.push({
						source_type: source_type,
						source_config: source_config
					})
				}
	
				shop.sources = sources
	
				let updatedShop = await this.shopRepository.findShopAndUpdateByTitle(title, shop)
	
				return res.end(updatedShop)
			} else {
				let createdShop = await this.shopRepository.storeShop(title, source_type, source_config)
				return res.end(JSON.stringify(createdShop))
			}
		} catch (error) {
			res.status(404)
			return res.end(error.message)
		}
	}

	async processXML(req, res, next)
	{
		try {
			let filename = req.params.filename
			let source_type = req.params.source_type
			let id = req.params.id

			const utils = Utils

			const fields = fieldsXML

			let response = await utils.parseFile(fields, filename).catch(err => {
				res.status(404)
				return res.end(err)
			})

			let products = response['products']

			if(products === undefined){
				res.status(404)
				return res.end({ error: "Products don't exist!"})
			}

			let total_products = products.length
			let processed = 0
			let toSave = 0

			let products_chunks = utils.chunk(products, 250)

			let shop = await this.shopRepository.findShopById(id)

			if ( typeof shop === 'undefined') {
				res.status(404)
				return res.end({ error: "Shop does not exist!"})
			}

			let shop_slug = slugify(shop.title, {
				lower: true,
				strict: true,
			})

			let collection_name = `products_${source_type}_${shop_slug}`

			let products_save = []

			let model = await this.shopRepository.getSourceTypeModel(source_type, collection_name)

			await products_chunks.reduce(async (memo, productsBatch) => {

				await memo
		
				await Promise.all( productsBatch.map(async (product) => {
					let sku = product['sku']

					let existingProduct = await this.shopRepository.findProductBySku(model, sku)
		
					if(existingProduct){
						console.log('product already exists')
					}else{
						products_save.push(product)
						toSave++
					}
		
					processed++
				}))
		
				console.log(`${processed}/${total_products}`)
		
				if(toSave !== 0 && toSave % 250 === 0){
					console.log(`Saved: ${toSave}`)

					this.shopRepository.storeProductsMany(model, products_save)
		
					products_save = []
				}
			}, undefined)
		
			if(products_save.length){
				this.shopRepository.storeProductsMany(model, products_save)
			}
		
			return res.send({'toSave': toSave})
		} catch (error) {
			res.status(404)
			res.end(error.message)
		}
	}

	async downloadXML(req, res, next)
	{
		try {
			let id = req.params.id
			let source_type = req.params.source_type

			let shop = await this.shopRepository.findShopById(id)

			let filenameXML = `${source_type}-${shop.slug}.xml`
			let sourceFilenameXML = await this.shopRepository.getShopSourceXML(shop, source_type)

			if(sourceFilenameXML === null){
				res.status(404)
				return res.end('Source url does not exist')
			}
			
			const utils = Utils;

			await utils.downloadFile(sourceFilenameXML, filenameXML)

			return res.send({
				xml_filename: filenameXML
			})
		} catch (error) {
			res.status(404)
			res.end(error.message)
		}
	}

	async deleteShopById(req, res, next)
	{
		try {
			let shop = await this.shopRepository.deleteShopById(req.params.id)
			res.send(shop)
		} catch (error) {
			res.status(404)
			res.end(error.message)
		}
	}

	async getShopById(req, res, next)
	{
		try {
			let shop = await this.shopRepository.findShopById(req.params.id)
			res.send(shop)
		} catch (error) {
			res.status(404)
			res.end({ error: error })
		}
	}

	async getShops(req, res, next)
	{
		try {
			let shops = await this.shopRepository.findAllLeanShops()
			
			shops = await this.shopRepository.findAllLeanShopsWithCounts(shops)

			res.send(shops)

		} catch (error) {
			res.status(404)
			res.end(error.message)
		}
	}
}