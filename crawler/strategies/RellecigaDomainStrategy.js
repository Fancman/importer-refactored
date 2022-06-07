import DomainStrategy from './index.js'

export default class RellecigaDomainStrategy extends DomainStrategy {
	name = 'relleciga.sk'

	constructor(){
		super()
	}

	log(){
		console.log("TEST")
	}
}