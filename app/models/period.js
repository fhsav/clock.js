var mongoose = require('mongoose')
  , Schema = mongoose.Schema
  , ObjectId = Schema.ObjectId;
var moment = require('moment');

var periodSchema = new Schema({
  'number': Number,
  'text': String,
  'start': Date,
  'finish': Date,
  'schedule_id': ObjectId
});

// Static methods

periodSchema.statics.normalize = function(isoTime) {
  var timezone = isoTime.getTimezoneOffset() / 60;
  var hour = moment(isoTime).hour();
  var time = moment(isoTime).hour(hour + timezone);
  return moment(time).format("h:mm");
};

periodSchema.statics.normalize24 = function(isoTime) {
  var timezone = isoTime.getTimezoneOffset() / 60;
  var hour = moment(isoTime).hour();
  var time = moment(isoTime).hour(hour + timezone);
  return moment(time).format("HH:mm");
};

/**
* RFC 3339 partial-time
*/
periodSchema.statics.normalizeForDatetime = function(isoTime) {
  var timezone = isoTime.getTimezoneOffset() / 60;
  var hour = moment(isoTime).hour();
  var time = moment(isoTime).hour(hour + timezone);
  return moment(time).format("HH:mm:ss");
}

/** Parse time in hh:mm format to Date() */
periodSchema.statics.parseTime = function(time) {
  var timezone = new Date().getTimezoneOffset() / 60;
  time = moment(time, "HH:mm").toDate();
  time.setHours(time.getHours() - timezone);
  return time;
};

// Virtual properties

periodSchema.virtual('normalized.start').get(function () {
  return periodSchema.statics.normalize(this.start);
});

periodSchema.virtual('normalized.finish').get(function () {
  return periodSchema.statics.normalize(this.finish);
});

periodSchema.virtual('normalized.military.start').get(function () {
  return periodSchema.statics.normalize24(this.start);
});

periodSchema.virtual('normalized.military.finish').get(function () {
  return periodSchema.statics.normalize24(this.finish);
});

periodSchema.virtual('datetime.start').get(function () {
  return periodSchema.statics.normalizeForDatetime(this.start);
});

periodSchema.virtual('datetime.finish').get(function () {
  return periodSchema.statics.normalizeForDatetime(this.finish);
});

mongoose.model('Period', periodSchema);
