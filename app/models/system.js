var fs = require('fs');
var yaml = require('js-yaml');
var redis = require('redis');
var sha1 = require('sha1');

var datastore = yaml.load(fs.readFileSync(__dirname + '/../../config/datastore.yaml', 'utf8'));
var redis_uri = datastore.redis_uri || process.env['REDIS_URI'] || 'redis://localhost:6379';

var redis_uri = require('url').parse(redis_uri);
var client = redis.createClient(redis_uri.port, redis_uri.hostname);

// http://blog.jerodsanto.net/2011/06/connecting-node-js-to-redis-to-go-on-heroku/
if (redis_uri.auth) client.auth(redis_uri.auth.split(":")[1]);

function System() {
  var self = this;

  client.get('password', function(err, reply) {
    self.configured = reply == null ? false : true;
  });
}

System.prototype.isConfigured = function() {
  return this.configured;
};

System.prototype.setPassword = function(password, callback) {
  var self = this;

  client.set('password', sha1(password), function(err, reply) {
    if (err) callback(err);
    self.configured = true;
    callback(null);
  });
};

System.prototype.validatePassword = function(candidatePassword, callback) {
  client.get('password', function(err, reply) {
    if (sha1(candidatePassword) == reply) {
      callback(null);
    } else {
      callback(new Error("Authentication fail"));
    }
  });
};

module.exports = new System();
