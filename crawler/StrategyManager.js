'use strict';

export default class StrategyManager {

	_strategies = []
	
	constructor() {}

	addStrategy(strategy) {
		this._strategies = [ ...this._strategies, strategy ]
	}

	getStrategy(name) {
		return this._strategies.find( strategy => strategy.name === name )
	}

	getStrategiesNames() {
		return [ ...this._strategies.map( o => o.name ) ]
	}

}
