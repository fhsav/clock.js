var MongoClient = require('mongodb').MongoClient;
var moment = require('moment');

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
	this.collection.find({schedule_id: scheduleID}).toArray(callback);
};

Periods.prototype.normalizeTime = function(isoTime) {
    var timezone = isoTime.getTimezoneOffset() / 60;
    var hour = moment(isoTime).hour();
    var time = moment(isoTime).hour(hour + timezone);
    return moment(time).format("hh:mm");
};

module.exports = new Periods();