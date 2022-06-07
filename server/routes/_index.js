import express from "express"

export default class Route {

	_router = null

	constructor () {
		this._router = express.Router()
		this.indexRoutes()
	}

	indexRoutes(){}

	getRouter() {
		return this._router
	}
}