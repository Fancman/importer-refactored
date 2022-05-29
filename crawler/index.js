class Domain {
	constructor( name ) {
		this.name = name
	}
}

let DomainsCollection = function() {
	let domains = {}

	return {
		registerDomain: function( domain ) {
			domains[domain.name] = domain
		}
	}
}