import mongoose from "mongoose";

let Database = {
    process: function () {
        this.connect();

		let model = this.getModel()

        return model;
    }
};

function inherit(proto) {
    let F = function () { };
    F.prototype = proto;
    return new F();
}


function MongoDatabase(modelName, modelSchema, collectionName) {
    let mongodb = inherit(Database);

    mongodb.connect = async function () {

		try {
			if(![1,2].includes(mongoose.connection.readyState)){
				await mongoose.connect('mongodb://127.0.0.1:27017/importer');
			}
		} catch (error) {
			console.log('Failed to connect to MongoDB', error)
		}
    };

    mongodb.getModel = async function () {

		if( typeof collectionName !== 'undefined' ) {
			return mongoose.model(modelName, modelSchema, collectionName)
		}
        
		return mongoose.model(modelName, modelSchema)
    };

    return mongodb.process();
}


export {
	MongoDatabase
}