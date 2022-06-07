import mongoose from "mongoose"
const Schema = mongoose.Schema

export default new Schema({
	title: String,
	title_extended: String,
	description: String,
	link: {
		type: String,
		unique: true,
		sparse: true
	},
	primary_image: String,
	category_text: String,
	category_arr: [],
	brand: String,
	availability: String,
	price: Number,
	sku: {
		type: String,
		unique: true,
		sparse: true
	},
	params: {}
}, {strict: false, timestamps: true})