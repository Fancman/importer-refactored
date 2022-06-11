import express from "express"

export default class Route {

	_router

	constructor () {
		this._router = null
		this._router = express.Router()
		this.indexRoutes()
	}

	indexRoutes(){}

	getRouter() {
		return this._router
	}
}