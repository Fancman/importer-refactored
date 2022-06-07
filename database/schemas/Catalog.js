import mongoose from "mongoose"
const Schema = mongoose.Schema

export default new Schema({
	title: String,
	url: String,
	slug: {
		type: String,
		unique: true
	},
	scrapers: [
		{
			name: String,
			links: [],
		}
	],
	createdAt: { type: Date, default: Date.now }
})