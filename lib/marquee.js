var MongoClient = require('mongodb').MongoClient;

function Marquee() {
	this.a = 1;
}

Marquee.prototype.setMongoDB = function(db) {
	this.db = db;
};

Marquee.prototype.getAll = function(callback) {
	var collection = this.db.collection('marquees');
	collection.find().toArray(function(err, docs) {
		if (err) callback(err);
		else callback(null, docs);
	});
};

module.exports = new Marquee();