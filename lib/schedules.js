var ClockObject = require('./ClockObject.js');
var MongoClient = require('mongodb').MongoClient;
var util = require('util');

function Schedules() {
  this.collection = 'schedules';
}

util.inherits(Schedules, ClockObject);

Schedules.prototype.activate = function(objectID, callback) {
  var self = this;

  self.update({active: true}, { $set: {active: false} }, {multi: true}, function(err) {
    self.update({_id: objectID}, { $set: {active: true} }, {}, function(err) {
      callback(err);
    });
  });
};

Schedules.prototype.getActive = function(callback) {
  this.collection.findOne({active: true}, callback);
};

module.exports = new Schedules();