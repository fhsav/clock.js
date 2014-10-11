var fs = require('fs');
var mongoose = require('mongoose');
var yaml = require('js-yaml');

// Grab settings
var datastore = yaml.load(fs.readFileSync(__dirname + '/../config/datastore.yaml', 'utf8'));
var mongodb_uri = datastore.mongodb_uri || process.env.MONGODB_URI || 'localhost';

describe('MongoDB', function() {
  it('should connect', function(done) {
    mongoose.connect(datastore.mongodb_uri);

    var db = mongoose.connection;
    db.on('error', done);
    db.once('open', done);
  });
});
