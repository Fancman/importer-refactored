export default class DomainStrategy {
	constructor(){}

	async getLinksAndPagination(){
		console.log("Getting links and pagination")
	}

	async parsePage(){
		console.log("Parsing page")
	}

	getName(){
		return this.name
	}
}