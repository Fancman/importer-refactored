const Server = require("./server/index");

(async () => {
	/*console.log("START")
	let crawler = new Crawler()
	crawler.startInspectingPages('relleciga.sk')*/
	

	let server = new Server();
	
	server.start();
})();
