var MongoClient = require('mongodb').MongoClient;

function Notices() {}

Notices.prototype.setMongoDB = function(db) {
	this.db = db;
};

Notices.prototype.getAll = function(callback) {
	var collection = this.db.collection('notices');
	collection.find().toArray(function(err, docs) {
		if (err) callback(err);
		else callback(null, docs);
	});
};

module.exports = new Notices();