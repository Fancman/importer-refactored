import { response } from "express"
import Utils from "../../utils/index.js"

export default class DomainStrategy {
	
	_mandatoryFields = []
	_priceFields = [
		'price',
		'sale_price'
	]
	_textFields = [
		'title',
		'description'
	]

	_utils = null

	constructor(){
		this._utils = Utils
	}

	async getLinksAndPagination(){
		console.log("Getting links and pagination")
	}

	async parsePage(){
		console.log("Parsing page")
	}

	async checkData(){
		console.log("Checking data")
	}

	getName(){
		return this.name
	}

	cleanParsedData = async ( inspectData ) => {
		try {
			inspectData = this.fixPriceFields( inspectData )
			inspectData = this.fixTextFields( inspectData )
	
		} catch (error) {
			console.log(error.message)	
		}

		return inspectData
	}

	fixPriceFields ( inspectData ) {
		for  ( const field of this._priceFields ) {
			if ( inspectData.response.hasOwnProperty(field) ) {
				let price = this._utils.extractPrice(inspectData.response[field])

				if ( price !== null ) {
					inspectData.response[field] = price.replace(',', '.')
				} else {
					inspectData.response[field] = null
				}
			}
		}

		return inspectData
	}

	fixTextFields ( inspectData ) {
		for  ( const field of this._textFields ) {
			if ( inspectData.response.hasOwnProperty(field) ) {
				
				let text = this._utils.clearText( inspectData.response[ field ] )

				inspectData.response[field] = text
			}
		}

		return inspectData
	}

	checkMandatoryFields ( inspectData ){
		let errors = []

		for ( const field of this._mandatoryFields ) {

			if ( Array.isArray(field) ) {

				let atleastOne = false

				for ( const option of field ) {
					if ( inspectData.response.hasOwnProperty(option) ) { atleastOne = true }
				}

				if ( atleastOne === false ) {
					errors.push(`${JSON.stringify(field)} fields are not set`)
				}

			} else if ( typeof field === 'string' ){
				if ( ! inspectData.response.hasOwnProperty(field) ){
					errors.push(`${field} field is not set`)
				}
			}
		}

		return errors
	}

	inspectDataHasErrorsField = ( inspectData ) => {
		return inspectData.hasOwnProperty('responseErrors')
	}

	addErrorToReponse = ( inspectData, errorMsg ) => {
		if ( this.inspectDataHasErrorsField( inspectData ) === false ){
			inspectData.responseErrors = []
		}

		if ( Array.isArray( errorMsg ) ) {
			inspectData.responseErrors = inspectData.responseErrors.concat(errorMsg)
		} else if ( typeof errorMsg === 'string' ) {
			inspectData.responseErrors.push( errorMsg )
		}

		return inspectData
	}

	checkData = async ( inspectData ) => {

		if( inspectData.error !== null ) {
			inspectData = this.addErrorToReponse(inspectData, `Error while inspecting page`)
			
			return inspectData
		}

		let resCodeStr = inspectData.code.toString()

		if ( !( resCodeStr.startsWith(2) || resCodeStr.startsWith(3) ) ) {

			inspectData = this.addErrorToReponse(inspectData, `Wrong status code [${resCodeStr}]`)
			
			return inspectData
		}

		let checkMandatoryFieldsResult = this.checkMandatoryFields( inspectData )

		if ( checkMandatoryFieldsResult.length ) {
			inspectData = this.addErrorToReponse(inspectData, checkMandatoryFieldsResult)

			return inspectData
		}

		return 1
	}
}