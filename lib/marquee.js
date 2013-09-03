var MongoClient = require('mongodb').MongoClient;

function Marquee() {}

Marquee.prototype.setMongoDB = function(db) {
	this.db = db;
	this.collection = this.db.collection('marquees');
};

Marquee.prototype.getAll = function(callback) {
	this.collection.find().toArray(function(err, docs) {
		if (err) callback(err);
		else callback(null, docs);
	});
};

module.exports = new Marquee();