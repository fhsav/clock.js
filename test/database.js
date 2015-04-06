var fs = require('fs');
var mongoose = require('mongoose');

// Grab settings
var datastore = require(__dirname + '/config/datastore');
var mongodb_uri = datastore.mongodb_uri || process.env.MONGODB_URI || 'localhost';

describe('MongoDB', function() {
  it('should connect', function(done) {
    mongoose.connect(mongodb_uri);

    var db = mongoose.connection;
    db.on('error', done);
    db.once('open', done);
  });
});
