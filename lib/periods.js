var ClockObject = require('./ClockObject.js');
var MongoClient = require('mongodb').MongoClient;
var util = require('util');
var moment = require('moment');

function Periods() {
  this.collection = 'periods';
}

util.inherits(Periods, ClockObject);

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