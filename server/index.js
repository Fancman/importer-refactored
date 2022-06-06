const express = require("express")
const bodyParser = require("body-parser")

const Router = require('./router')

module.exports = class Server {

	_server = null
	_app = null
	
	constructor() {
		this._app = express()
		this._app.set("port", this.getPort())

		this.configureMiddleware()
		this.configureRoutes()
	}

	configureMiddleware() {
		this._app.use(bodyParser.json())
		this._app.use(bodyParser.urlencoded({ extended: true }))

		// CORS
        this.app.use(function (req, res, next) {
            res.setHeader("Access-Control-Allow-Origin", "*");
            res.setHeader("Access-Control-Allow-Credentials", "true");
            res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
            res.setHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Origin,Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers,Authorization");
            next();
        })
	}

	configureRoutes() {
		new Router(this._app).addRoutes()
	}

	start() {
        this._server = this._app.listen(this._app.get("port"), () => {
            console.log("🚀 Server is running on port " + this._app.get("port"));
        });
    }

	getPort() {
		return process.env.PORT || 4000
	}

	get app() {
		return this._app
	}

	get server() {
		return this._server
	}
}