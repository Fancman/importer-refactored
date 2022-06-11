import DomainStrategy from './index.js'

export default class SaxanaDomainStrategy extends DomainStrategy {
	name = 'saxana.sk'

	_mandatoryFields = [
		'title',
		['price', 'sale_price'],
	]

	constructor(){
		super()
	}

	getLinksAndPagination = async function(page){
		return await page.evaluate(function(){ // ...this runs in the context of the browser
			let links = [... document.querySelectorAll('main#maincontent .columns .products .product-items li.product-item a.product')];
			let paginationLinks = [... document.querySelectorAll('main#maincontent .columns .toolbar .pages ul.pages-items li.item a.page')]
	
			let paginationHrefs = paginationLinks.map(function(link){
				return link.href;
			})
	
			let uniquePaginationHrefs = [...new Set(paginationHrefs)];
	
			let linksHrefs = links.map( function(link){
				return link.href;
			})
	
			return {
				'links': linksHrefs,
				'paginations': uniquePaginationHrefs
			};
		});
	}
	
}