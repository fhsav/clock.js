var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectID;

function Schedules() {}

Schedules.prototype.setMongoDB = function(db) {
	this.db = db;
	this.collection = this.db.collection('schedules');
};

Schedules.prototype.getAll = function(callback) {
	this.collection.find().toArray(function(err, docs) {
		if (err) callback(err);
		else callback(null, docs);
	});
};

Schedules.prototype.update = function(criteria, objNew, options, callback) {
	this.collection.update(criteria, objNew, options, callback);
};

Schedules.prototype.activate = function(objectID, callback) {
	var self = this;

	self.update({active: true}, { $set: {active: false} }, {multi: true}, function(err) {
		self.update({_id: new ObjectId(objectID)}, { $set: {active: true} }, {}, function(err) {
			callback(err);
		});
	});
};

module.exports = new Schedules();