import PaginationCrawler from "./PaginationCrawler.js"
import LinksInspectorCrawler from "./LinksInspectorCrawler.js"

export default async function ActionBuilder(strategy, data, tab, action){
	if ( action == 'PaginationCrawler' ) {
		//scraper_links
		return new PaginationCrawler(strategy, data, tab)
	} else if ( action === 'LinksInspectorCrawler' ){
		//product_links
		return new LinksInspectorCrawler(strategy, data, tab)
	}

	return null
}