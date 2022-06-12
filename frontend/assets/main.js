
const apis = {
	catalogsEndpointUrl: "http://localhost:4000/api/catalogs",
	productsEndpointUrl: "http://localhost:4000/api/products",
	shopsEndpointUrl: "http://localhost:4000/api/shops",
	//crawlerEndpointUrl: "http://localhost:4000/api/crawler"
	scrapersEndpointUrl: "http://localhost:4000/api/scrapers",
	//endpointUtils: "http://localhost:4000/api/utils",
}

const twillApis = {
	categories: 'http://admin.twill.localhost/api/categories',
	products: 'http://admin.twill.localhost/api/products',
}

const requestHandler = async function(endpointUrl, options = {}) {
	return new Promise(async (resolve, reject) => {
		console.log('RequestHandler', options)

		let data = await fetch(endpointUrl, options)
		.then(r => r.json())
		.then(response => {
			return resolve(response)
		})
		.catch(err => {
			return reject(err)
		})
	})
	
}

const capitalizeFirstLetter = function(string) {
	return string.charAt(0).toUpperCase() + string.slice(1);
}