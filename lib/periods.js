var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectID;

function Periods() {}

Periods.prototype.setMongoDB = function(db) {
	this.db = db;
	this.collection = this.db.collection('periods');
};

Periods.prototype.getAll = function(callback) {
	this.collection.find().toArray(function(err, docs) {
		if (err) callback(err);
		else callback(null, docs);
	});
};

Periods.prototype.update = function(criteria, objNew, options, callback) {
	this.collection.update(criteria, objNew, options, callback);
};

Periods.prototype.getAllByScheduleID = function(scheduleID, callback) {
	this.collection.find({schedule_id: scheduleID}).toArray(function(err, docs) {
		if (err) callback(err);
		else callback(null, docs);
	});
};

module.exports = new Periods();