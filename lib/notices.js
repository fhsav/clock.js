var ClockObject = require('./ClockObject.js');
var MongoClient = require('mongodb').MongoClient;
var ObjectID = require('mongodb').ObjectID;
var util = require('util');

function Notices() {
  this.collection = 'notices';
}

util.inherits(Notices, ClockObject);

Notices.prototype.create = function(text, callback) {
  this.collection.insert({
    'id': new ObjectID(),
    'text': text
  }, callback);
};

Notices.prototype.updateText = function(objectID, text, callback) {
  this.update({_id: objectID}, { $set: {'text': text} }, {}, callback);
};

module.exports = new Notices();
