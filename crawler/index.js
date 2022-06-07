'use strict';

export class StrategyManager {

	_strategies = []
	
	constructor() {}

	addStrategy(strategy) {
		this._strategies = [ ...this._strategies, strategy ]
	}

	getStrategy(name) {
		return this._strategies.find(strategy => strategy.name === name)
	}


	getStrategiesNames() {
		return [ ...this._strategies.reduce( function(a, b){
			return b.name
		}) ]
	}

}
