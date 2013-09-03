var MongoClient = require('mongodb').MongoClient;

function Themes() {}

Themes.prototype.setMongoDB = function(db) {
	this.db = db;
};

Themes.prototype.getAll = function(callback) {
	var collection = this.db.collection('themes');
	collection.find().toArray(function(err, docs) {
		if (err) callback(err);
		else callback(null, docs);
	});
};

module.exports = new Themes();