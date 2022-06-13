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

	parsePage = async function(page){
		return await page.evaluate( () => {
	
			let output = {
				'currency' : function(){
					return 'EUR';
				},
				'title' : function(){
					let elm = document.querySelector('#center_column #primary_block h1.pd-title')	
				
					if(elm){
						return elm.textContent
					}
				},
				'price' : function(){
					let elm = document.querySelector('#center_column #primary_block #pb-left-column #buy_block .price p.our_price_display span#our_price_display')
							
					if( elm ){
						return elm.textContent
					}
					
				},
				'sale_price' : function(){
					let elm = document.querySelector('#center_column #primary_block #pb-left-column #buy_block #old_price span#old_price_display')
	
					if(elm){
						return elm.textContent
					}
				},
				'primary_image' : function(){
					let elm = document.querySelector('#center_column #primary_block #pb-right-column #image-block img#bigpic')
	
					if(elm){
						return elm.src
					}
				},
				'attr.sizes' : function(){				

					let sizes = []

					let elms = [... document.querySelectorAll('#center_column #primary_block #pb-left-column #buy_block #attributes div.clearfix')]

					elms.forEach( optionBox => {
						if ( optionBox.textContent.includes('Veľkosť') ) {
							let sizesElms = optionBox.querySelectorAll('select.pa-group option')

							sizesElms.forEach( sizesElm => {
								sizes.push(sizesElm.textContent)
							})
						}
					})

					return sizes
				},
				'description' : function(){
					let selectors = [
						'#center_column .breadcrumb',
						'#center_column #primary_block #pb-left-column #short_description_block #short_description_content',
						'#center_column #more_info_block'
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
					
					if ( fieldValue !== '' && fieldValue !== null  &&  typeof fieldValue !== 'undefined') {
						outputData[field] = fieldValue
					}

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