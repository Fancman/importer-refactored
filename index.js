import Server from "./server/index.js"
import StrategyManager from "./crawler/index.js"

import RellecigaDomainStrategy from './crawler/strategies/RellecigaDomainStrategy.js'

(async () => {
	/*console.log("START")
	let crawler = new Crawler()
	crawler.startInspectingPages('relleciga.sk')*/

	let strategyManager = new StrategyManager();

	strategyManager.addStrategy(new RellecigaDomainStrategy())

	//console.log(strategyManager.getStrategiesNames())

	let server = new Server(strategyManager);
	
	server.start();
})();
