var mongo = require('mongodb');
var MongoClient = require('mongodb').MongoClient;
var Grid = require('gridfs-stream');

function Themes() {}

Themes.prototype.setMongoDB = function(db) {
	this.db = db;
	this.collection = this.db.collection('themes');
	this.gfs = Grid(db, mongo);
};

Themes.prototype.getAll = function(callback) {
	this.collection.find().toArray(function(err, docs) {
		if (err) callback(err);
		else callback(null, docs);
	});
};

Themes.prototype.update = function(criteria, objNew, options, callback) {
	this.collection.update(criteria, objNew, options, callback);
};

Themes.prototype.activate = function(objectID, callback) {
	var self = this;

	self.update({active: true}, { $set: {active: false} }, {multi: true}, function(err) {
		self.update({_id: objectID}, { $set: {active: true} }, {}, function(err) {
			callback(err);
		});
	});
};

Themes.prototype.getWallpaperStream = function(objectID) {
	return this.gfs.createReadStream({
		_id: objectID
	});
};

module.exports = new Themes();