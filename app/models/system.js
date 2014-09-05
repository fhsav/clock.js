var redis = require("redis")
  , client = redis.createClient();
var sha1 = require('sha1');

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
