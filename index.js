import Server from "./server/index.js"
import StrategyManager from "./crawler/StrategyManager.js"
import CrawlerManager from "./crawler/CrawlerManager.js"

import RellecigaDomainStrategy from './crawler/strategies/RellecigaDomainStrategy.js'

(async () => {
	/*console.log("START")
	let crawler = new Crawler()
	crawler.startInspectingPages('relleciga.sk')*/

	let strategyManager = new StrategyManager();
	let crawlerManager = new CrawlerManager();

	strategyManager.addStrategy(new RellecigaDomainStrategy())

	//console.log(strategyManager.getStrategiesNames())

	let server = new Server(strategyManager, crawlerManager);
	
	server.start();
})();
