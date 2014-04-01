var ClockObject = require('./ClockObject.js');
var MongoClient = require('mongodb').MongoClient;
var ObjectID = require('mongodb').ObjectID;
var util = require('util');

function Schedules() {
  this.collection = 'schedules';
}

util.inherits(Schedules, ClockObject);

Schedules.prototype.create = function(name, description, callback) {
  this.collection.insert({
    '_id': new ObjectID(),
    'name': name,
    'description': description,
    'active': false,
    'updated_at': new Date(),
    'created_at': new Date()
  }, callback);
};

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
