import DomainStrategy from './index.js'

export default class SperkyEshopDomainStrategy extends DomainStrategy {
	name = 'sperky-eshop.sk'

	_mandatoryFields = [
		'title',
		['price', 'sale_price'],
	]

	constructor(){
		super()
	}

	getLinksAndPagination = async function(page){
		return await page.evaluate(function(){
			let links = [... document.querySelectorAll('#center_column #pds ul.pd-block li.item .pd-img a')];
			let paginationLinks = [... document.querySelectorAll('#center_column #pds ul.pagination li a')]
	
			let paginationHrefs = paginationLinks.map(function(link){
				let page = link?.dataset?.p
				return link.href + `?p=${page}`;
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