class DBUtils {

	async updateMany(Model, filter, update) {
		return new Promise(async (resolve, reject) => {
			 Model.updateMany(filter, update, function(err, doc) {
	
				if( err ) {
					return reject(err)
				}
	
				return resolve(doc)
			})
		})
	}

	async find(Model, query) {
		return new Promise( (resolve, reject) => {
			try {
				Model.find(query).then( (docs) => {
					return resolve(docs)
				})
			} catch (error) {
				return reject(error)
			}
		})
	}

	async findOne(Model, record) {
		return new Promise( (resolve, reject) => {
			try {
				Model.findOne(record).then( (doc) => {
					return resolve(doc)
				})
			} catch (error) {
				return reject(error)
			}
		})
	}

	async findUpsert(Model, query, record, options = { upsert: true }) {
		return new Promise( (resolve, reject) => {
			try {
				Model.update(query, record, options).then( (doc) => {
					return resolve(doc)
				})
			} catch (error) {
				return reject(error)
			}
		})
	}

	async insertRecord(Model, record) {
		return new Promise( (resolve, reject) => {
			try {
				Model.create(record).then( (doc) => {
					return resolve(doc)
				})
			} catch (error) {
				return reject(error)
			}
		})
	}

	async findUpdateById(Model, record, id) {
		return new Promise( (resolve, reject) => {
			 Model.findByIdAndUpdate(id, record, (err, doc) => {
	
				if(err){
					return reject(err)
				}
	
				return resolve(doc)
			})
		})
	}

	async getCount(Model) {
		return new Promise( (resolve) => {
			if( Model === null ) {
				return resolve(0);
			}
			
			Model.count({}, (err, count) => {
				return resolve(count)
			});
		})
	}

	async storeMany(Model, records){
		return new Promise( (resolve) => {
			try {
				Model.insertMany(records).then( (docs) => {
					return resolve(docs)
				})
			} catch (error) {
				return resolve(null)
			}
		})
	}

}

export default new DBUtils();