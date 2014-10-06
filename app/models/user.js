var crypto = require('crypto');
var mongoose = require('mongoose')
  , Schema = require('mongoose').Schema;

var userSchema = new Schema({
  'active': { type: Boolean, default: false },
  'name': String,
  'password': String,
  'created_at': { type: Date, default: Date.now },
  'updated_at': { type: Date, default: Date.now }
});

// Static Methods

userSchema.statics.getActive = function(callback) {
  this.findOne({ active: true }, callback);
};

userSchema.statics.provideHash = function(password) {
  return crypto.createHash('sha512').update(password).digest('hex');
}

// Instance methods

userSchema.methods.activate = function(callback) {
  var self = this;

  this.model('User').update({active: true}, { $set: {active: false} }, {multi: true}, function(err) {
    if (err) callback(err);
    self.active = true;
    self.save(callback);
  });
};

userSchema.methods.checkPassword = function(password, callback) {
  if (this.model('User').provideHash(password) == this.password) {
    callback(null);
  } else {
    callback(new Error('Does not match'));
  }
};

mongoose.model('User', userSchema);
