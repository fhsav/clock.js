var fs = require('fs');
var mongoose = require('mongoose');
var yaml = require('js-yaml');

// Grab settings
var database = yaml.load(fs.readFileSync(__dirname + '/../config/database.yaml', 'utf8'));
database.mongodb_uri = database.mongodb_uri || process.env['MONGODB_URI'] || 'localhost';

describe('MongoDB', function() {
  it('should connect', function(done) {
    mongoose.connect(database.mongodb_uri);

    var db = mongoose.connection;
    db.on('error', done);
    db.once('open', done);
  });
});
