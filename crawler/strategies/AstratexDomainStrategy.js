import DomainStrategy from './index.js'

export default class AstratexDomainStrategy extends DomainStrategy {
	name = 'astratex.sk'

	_mandatoryFields = [
		'title',
		['price', 'sale_price'],
	]

	constructor(){
		super()
	}

	getLinksAndPagination = async function(page){
		return await page.evaluate(function(){ // ...this runs in the context of the browser
			let links = [... document.querySelectorAll('.content .productBox .productBox_product a.mainImage')];
			let paginationLinks = [... document.querySelectorAll('.content .NavBar .pager-wrap a')]
	
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