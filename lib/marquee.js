var ClockObject = require('./ClockObject.js');
var MongoClient = require('mongodb').MongoClient;
var util = require('util');

function Marquee() {
  this.collection = 'marquees';
}

util.inherits(Marquee, ClockObject);

Marquee.prototype.create = function(text, callback) {
  this.collection.insert({
    'text': text,
  }, callback);
};

Marquee.prototype.updateText = function(objectID, text, callback) {
  this.update({_id: objectID}, { $set: {'text': text} }, {}, callback);
};

module.exports = new Marquee();