import Server from "./server/index.js"
import StrategyManager from "./crawler/StrategyManager.js"
import CrawlerManager from "./crawler/CrawlerManager.js"

import RellecigaDomainStrategy from './crawler/strategies/RellecigaDomainStrategy.js'
import AstratexDomainStrategy from './crawler/strategies/AstratexDomainStrategy.js'
import SaxanaDomainStrategy from './crawler/strategies/SaxanaDomainStrategy.js'

(async () => {
	/*console.log("START")
	let crawler = new Crawler()
	crawler.startInspectingPages('relleciga.sk')*/

	let strategyManager = new StrategyManager();
	let crawlerManager = new CrawlerManager();

	strategyManager.addStrategy(new RellecigaDomainStrategy())
	strategyManager.addStrategy(new AstratexDomainStrategy())
	strategyManager.addStrategy(new SaxanaDomainStrategy())

	//console.log(strategyManager.getStrategiesNames())

	let server = new Server(strategyManager, crawlerManager);
	
	server.start();
})();
