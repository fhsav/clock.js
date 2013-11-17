var MongoClient = require('mongodb').MongoClient;

function Marquee() {}

Marquee.prototype.setMongoDB = function(db) {
  this.db = db;
  this.collection = this.db.collection('Marquee');
};

Marquee.prototype.getByObjectID = function(objectID, callback) {
  this.collection.findOne({_id: objectID}, callback);
};

Marquee.prototype.getAll = function(callback) {
  this.collection.find().toArray(function(err, docs) {
    if (err) callback(err);
    else callback(null, docs);
  });
};

Marquee.prototype.update = function(criteria, objNew, options, callback) {
  this.collection.update(criteria, objNew, options, callback);
};

Marquee.prototype.updateText = function(objectID, text, callback) {
  this.update({_id: objectID}, { $set: {'text': text} }, {}, callback);
};

module.exports = new Marquee();