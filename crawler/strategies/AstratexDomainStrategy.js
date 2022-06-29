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

			paginationHrefs = paginationHrefs.filter(link => !link.includes('bonuspage'))
	
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
				'brand' : function(){
					let elm = document.querySelector('.content .column-2 .resp-tab-content .det-info .producer-link')	
				
					if(elm){
						return elm.textContent.trim()
					}
				},
				'title' : function(){
					let elm = document.querySelector('div[id="head-line"] h1')	
				
					if(elm){
						return elm.textContent
					}
				},
				'price' : function(){
					let elm = document.querySelector('.content .detailPrices .common-price span')
							
					if( elm ){
						return elm.textContent
					}

					elm = document.querySelector('.content .detailPrices .price-with-vat span')

					if( elm ){
						return elm.textContent
					}
				},
				'sale_price' : function(){
					let elm1 = document.querySelector('.content .detailPrices .price-with-vat span')
					let elm2 = document.querySelector('.content .detailPrices .common-price span')
	
					if(elm1 && elm2){
						return elm1.textContent
					}
				},
				'primary_image' : function(){
					let elm = document.querySelector('.detaiImage .itemGallery img#zoomImg')
	
					if(elm){
						return elm.src
					}
				},
				'attr.upper_part_sizes' : function(){	
					
					let sizes = []

					let elms = [... document.querySelectorAll('.detailBlock ol.steps li.step-size')]

					elms.forEach( optionBox => {
						let titleElm = optionBox.querySelector("p.title")

						if ( titleElm ) {
							if ( titleElm.textContent.trim() === 'Zvoľte veľkosť horného dielu') {
								
								let sizesElms = optionBox.querySelectorAll('select option')
	
								sizesElms.forEach( sizesElm => {
									let str = sizesElm.textContent
									if (str === 'zvoľte'){return}
									sizes.push(str)
								})
							}
						}
					})

					return sizes
				},
				'attr.sizes' : function(){		
					
					let sizes = []

					let elms = [... document.querySelectorAll('.detailBlock ol.steps li.step-size')]

					elms.forEach( optionBox => {
						let titleElm = optionBox.querySelector("p.title")

						if ( titleElm ) {
							if ( titleElm.textContent.trim() === 'Zvoľte veľkosť') {
								
								let sizesElms = optionBox.querySelectorAll('select option')
	
								sizesElms.forEach( sizesElm => {
									let str = sizesElm.textContent
									if (str === 'zvoľte'){return}
									sizes.push(str)
								})
							}
						}
					})

					return sizes
				},
				'attr.bottom_part_sizes' : function(){	
					
					let sizes = []

					let elms = [... document.querySelectorAll('.detailBlock ol.steps li.step-couple')]

					elms.forEach( optionBox => {
						let titleElm = optionBox.querySelector("p.title")

						if ( titleElm ) {
							if ( titleElm.textContent.trim() === 'Zvoľte veľkosť spodného dielu') {
								
								let sizesElms = optionBox.querySelectorAll('select option')
	
								sizesElms.forEach( sizesElm => {
									let str = sizesElm.textContent
									if (str === 'zvoľte'){return}
									sizes.push(str)
								})
							}
						}
					})

					return sizes
				},
				'attr.colors' : function(){				

					let colors = []

					let colorsElms = document.querySelectorAll('.detailBlock ol.steps li.step-color .colors li input')

					colorsElms.forEach( colorElm => {
						let color = colorElm.getAttribute('value-text')
						colors.push(color)
					})

					return colors
				},
				'description' : function(){
					let selectors = [
						'.column-2 #BookmarkForModul_1 .resp-tab-content',
						'.content #CategoryPar'
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