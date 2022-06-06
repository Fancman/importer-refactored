const express = require('express')

const ShopRepositoryFascade = require('../../database/repositories/Shop')

module.exports = class ShopRoute {

	_router = null
	

	constructor () {
		this._router = express.Router()
		this.shopRepository = new ShopRepositoryFascade()

		this.indexRoutes()
	}

	indexRoutes(){
		this._router.get('/', async (req, res, next) => {
			this.getShops(req, res, next)
		})

		this._router.get('/:id', async (req, res, next) => {
			this.getShopById(req, res, next)
		})
	}

	async getShopById(req, res, next)
	{
		try {
			let shop = await this.shopRepository.findShopById(req.params.id)
			res.send(shop)
		} catch (error) {
			res.status(404)
			res.send({ error: error })
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
			res.send({ error: error })
		}
	}

	getRouter() {
		return this._router
	}

}