class ActionCheck {
	check() {
		return false
	}

	checkAndContinue(data){
		let checkResult = this.check(data)

		if( checkResult === false && this._next ){
			this._next.checkAndContinue(data)
		}

		return checkResult
	}

	setNext(next) {
		this._next = next;

		return next;
	}
}

class CrawlPaginationActionCheck extends ActionCheck {

	check(data) {
		if( data.action !== 'crawlPaginationAndCollectLinks'){
			return false
		}

		if( !data.hasOwnProperty('scraper_links') ){
			return false
		}

		return 'PaginationCrawler'
	}
	
}

class InspectLinksActionCheck extends ActionCheck {

	check(data) {
		if( data.action !== 'inspectLinksAndStoreData'){
			return false
		}

		if( !data.hasOwnProperty('product_links') ){
			return false
		}

		return 'NotPaginationCrawler'
	}
	
}

export default function checkCrawlerActions(data){
	const crawlPaginationActionCheck = new CrawlPaginationActionCheck()
	const inspectLinksActionCheck = new InspectLinksActionCheck()

	crawlPaginationActionCheck.setNext(inspectLinksActionCheck);

	return crawlPaginationActionCheck.checkAndContinue(data);
}
