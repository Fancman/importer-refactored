import mongoose from "mongoose"
const Schema = mongoose.Schema

export default new Schema({
	title: String,
	slug: {
		type: String,
		unique: true
	},
	sources: [
		{
			source_type: String,
			source_collection: String,
			source_config: {}
		}
	],
	processing: {type : Boolean, default : false},
	createdAt: { type: Date, default: Date.now }
})