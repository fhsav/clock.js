var ClockObject = require('./ClockObject.js');
var MongoClient = require('mongodb').MongoClient;
var util = require('util');

function Notices() {
  this.collection = 'notices';
}

util.inherits(Notices, ClockObject);

module.exports = new Notices();