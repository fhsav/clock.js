var MongoClient = require('mongodb').MongoClient;

function Schedules() {}

Schedules.prototype.setMongoDB = function(db) {
	this.db = db;
};

Schedules.prototype.getAll = function(callback) {
	var collection = this.db.collection('schedules');
	collection.find().toArray(function(err, docs) {
		if (err) callback(err);
		else callback(null, docs);
	});
};

module.exports = new Schedules();