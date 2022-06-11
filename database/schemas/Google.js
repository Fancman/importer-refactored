import mongoose from "mongoose"
const Schema = mongoose.Schema

export default new Schema({
	title: String,
	description: String,
	link: {
		type: String,
		unique: true,
		sparse: true
	},
	primary_image: String,
	category_text: String,
	gender: String,
	brand: String,
	availability: String,
	price: String,
	sale_price: String,
	sku: {
		type: String,
		unique: true,
		sparse: true
	}
}, {strict: false, timestamps: true})