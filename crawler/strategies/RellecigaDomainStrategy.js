import DomainStrategy from './index.js'

export default class RellecigaDomainStrategy extends DomainStrategy {
	name = 'relleciga.sk'

	constructor(){
		super()
	}

	getLinksAndPagination = async function(page){
		return await page.evaluate(function(){ // ...this runs in the context of the browser
			let links = [... document.querySelectorAll('.product-listing .product-layout .product-thumb .caption h4.name a')];
			let paginationLinks = [... document.querySelectorAll('.product-listing .pagination ul.pagination li a')]
	
			let paginationHrefs = paginationLinks.map(function(link){
				return link.href;
			})
	
			let uniquePaginationHrefs = [...new Set(paginationHrefs)];
	
			let linksHrefs = links.map(function(link){
				return link.href;
			})
	
			return {
				'links': linksHrefs,
				'paginations': uniquePaginationHrefs
			};
		});
	}

	log(){
		console.log("TEST")
	}
}