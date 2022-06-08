import PaginationCrawler from "./PaginationCrawler.js"

export default async function ActionBuilder(strategy, links, tab, action){
	if (action == 'PaginationCrawler') {
		return new PaginationCrawler(strategy, links, tab)
	}

	return null
}