var ClockObject = require('./ClockObject.js');
var MongoClient = require('mongodb').MongoClient;
var ObjectID = require('mongodb').ObjectID;
var util = require('util');

function Marquee() {
  this.collection = 'marquees';
}

util.inherits(Marquee, ClockObject);

Marquee.prototype.create = function(text, callback) {
  this.collection.insert({
    '_id': new ObjectID(),
    'text': text,
    'updated_at': new Date(),
    'created_at': new Date()
  }, callback);
};

Marquee.prototype.updateText = function(objectID, text, callback) {
  this.update({_id: objectID}, { $set: {'text': text} }, {}, callback);
};

module.exports = new Marquee();
