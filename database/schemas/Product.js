import mongoose from "mongoose"
const Schema = mongoose.Schema

export default new Schema({
	url: {
		type: String,
		required: true,
		unique: true,
	},
	scraper_name: String,
	status: {
		type: String,
		default: 'none',
	},
	title: String,	
	price: Number,
	sale_price: Number,
	currency: String,
	description: String,
	brand: String,
	category: {
		id: Number,
		lft: Number,
		rgt: Number,
		lvl: Number,
	},
	primary_image: String,
	extension_image: String,
	middleware_id: Number,
}, {strict: false, timestamps: true})