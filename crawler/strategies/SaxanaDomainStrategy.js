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

	parsePage = async function(page){
		return await page.evaluate( () => {
	
			let output = {
				'currency' : function(){
					return 'EUR';
				},
				'brand' : function(){
					let elm = document.querySelector('.page-wrapper .page-main .product-info-main .additional-attributes-wrapper td.data[data-th="Značka"]')	
				
					if(elm){
						return elm.textContent.trim()
					}
				},
				'title' : function(){
					let elm = document.querySelector('.page-wrapper .page-main .product-info-main h1.page-title .base')	
				
					if(elm){
						return elm.textContent
					}
				},
				'price' : function(){
					let elm = document.querySelector('.page-wrapper .page-main .product-info-main .product-info-price .old-price .price-container .price')
							
					if( elm ){
						return elm.textContent
					}

					elm = document.querySelector('.page-wrapper .page-main .product-info-main .product-info-price .price-container .price')
							
					if( elm ){
						return elm.textContent
					}
					
				},
				'sale_price' : function(){
					let elm = document.querySelector('.page-wrapper .page-main .product-info-main .product-info-price .special-price .price-container .price')
	
					if (elm) {
						return elm.textContent
					}
				},
				'primary_image' : function(){
					let elm = document.querySelector('.page-wrapper .page-main .media .media-gallery ul.product-view-slider-images li.slick-current[data-slick-index="0"] img')
	
					if(elm){
						return elm.src
					}
				},
				'attr.sizes' : function(){				

					let sizes = []

					let sizesElms = document.querySelectorAll('select.super-attribute-select[data-placeholder="Veľkosť"] option .in-stock span.size')

					sizesElms.forEach( sizesElm => {
						sizes.push(sizesElm.textContent)
					})

					return sizes
				},
				'attr.cup_sizes' : function(){				

					let sizes = []

					let sizesElms = document.querySelectorAll('select.super-attribute-select[data-placeholder="Veľkosť košíkov"] option .in-stock span.size')

					sizesElms.forEach( sizesElm => {
						sizes.push(sizesElm.textContent)
					})

					return sizes
				},
				'description' : function(){
					let selectors = [
						'.page-wrapper .page-main .product-info-main .additional-attributes-wrapper'
					]
	
					let descriptionStr = ""
	
					for (const selector of selectors) {
						let elm = document.querySelector(selector)
	
						if(elm){
							descriptionStr += elm.textContent.trim()
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