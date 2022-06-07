const Server = require("./server/index");
const StrategyManager = require("./crawler/index")

//const RellecigaDomainStrategy = require("./crawler/strategies/RellecigaDomainStrategy")

(async () => {
	/*console.log("START")
	let crawler = new Crawler()
	crawler.startInspectingPages('relleciga.sk')*/

	let strategyManager = new StrategyManager();

	//strategyManager.addStrategy(new RellecigaDomainStrategy())

	let server = new Server();
	
	server.start();
})();
