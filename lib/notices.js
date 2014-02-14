var ClockObject = require('./ClockObject.js');
var MongoClient = require('mongodb').MongoClient;
var ObjectID = require('mongodb').ObjectID;
var util = require('util');

function Notices() {
  this.collection = 'notices';
}

Notices.prototype.create = function(text, callback) {
  this.collection.insert({
    'id': new ObjectID(),
    'text': text
  }, callback);
};

util.inherits(Notices, ClockObject);

module.exports = new Notices();