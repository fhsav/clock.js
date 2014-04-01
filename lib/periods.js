var ClockObject = require('./ClockObject.js');
var MongoClient = require('mongodb').MongoClient;
var ObjectID = require('mongodb').ObjectID;
var util = require('util');
var moment = require('moment');

function Periods() {
  this.collection = 'periods';
}

util.inherits(Periods, ClockObject);

Periods.prototype.create = function(scheduleID, number, text, start, finish, callback) {
  this.collection.insert({
    '_id': new ObjectID(),
    'number': number,
    'start': start,
    'finish': finish,
    'schedule_id': scheduleID,
    'text': text
  }, callback);
};

Periods.prototype.getAllByScheduleID = function(scheduleID, callback) {
  this.collection.find({schedule_id: scheduleID}).toArray(callback);
};

Periods.prototype.normalizeTime = function(isoTime) {
  var timezone = isoTime.getTimezoneOffset() / 60;
  var hour = moment(isoTime).hour();
  var time = moment(isoTime).hour(hour + timezone);
  return moment(time).format("h:mm");
};

Periods.prototype.normalizeTime24 = function(isoTime) {
  var timezone = isoTime.getTimezoneOffset() / 60;
  var hour = moment(isoTime).hour();
  var time = moment(isoTime).hour(hour + timezone);
  return moment(time).format("HH:mm");
}

/** Parse time in hh:mm format to Date() */
Periods.prototype.parseTime = function(time) {
  var timezone = new Date().getTimezoneOffset() / 60;
  time = moment(time, "HH:mm").toDate();
  time.setHours(time.getHours() - timezone);
  return time;
};

module.exports = new Periods();
