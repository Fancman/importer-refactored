import DomainStrategy from './index.js'

export default class RellecigaDomainStrategy extends DomainStrategy {
	name = 'relleciga.sk'

	_mandatoryFields = [
		'title',
		['price', 'sale_price'],
	]

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

	parsePage = async function(page){
		return await page.evaluate( () => {
	
			let output = {
				'currency' : function(){
					return 'EUR';
				},
				'brand' : function(){
					return 'Relleciga';
				},
				'title' : function(){
					let elm = document.querySelector('#content header.page-header h1')	
				
					if(elm){
						return elm.textContent
					}
				},
				'price' : function(){
					let elm = document.querySelector('#content #product .price span.price-old span#price_new_ajaxx')
							
					if( elm ){
						return elm.textContent
					}

					elm = document.querySelector('#content #product .price span.price-normal span#price_new_ajaxx')

					if( elm ){
						return elm.textContent
					}
				},
				'sale_price' : function(){
					let elm = document.querySelector('#content #product .price span.price-new span#price_new_ajaxx')
	
					if(elm){
						return elm.textContent
					}
				},
				'primary_image' : function(){
					let elm = document.querySelector('#content .image #wrap a#image')
	
					if(elm){
						return elm.href
					}
				},
				'attr.sizes' : function(){				

					let sizes = []

					let elms = [... document.querySelectorAll('#product .form-group')]

					elms.forEach( optionBox => {
						if ( optionBox.textContent.includes('Ve??kos??') ) {
							let sizesElms = optionBox.querySelectorAll('div.radio label span')

							sizesElms.forEach( sizesElm => {
								sizes.push(sizesElm.textContent)
							})
						}
					})

					return sizes
				},
				'description' : function(){
					let selectors = [
						'#full-info .tab-content #tab-description',
						'#content .description'
					]
	
					let descriptionStr = ""
	
					for (const selector of selectors) {
						let elm = document.querySelector(selector)
	
						if(elm){
							descriptionStr += elm.textContent
						}
					}
	
					return descriptionStr
				}
			}
	
			let outputData = {
				fieldErrors: []
			}
	
			for (const [field, fnc] of Object.entries(output)) {
				try {
					let fieldValue = fnc()
					
					outputData[field] = fieldValue

				} catch (error) {
					outputData.errors.push(
						{
							field: field,
							message: error.message
						}
					)
				}
			}
	
			return outputData
			
		});
	}
	
}