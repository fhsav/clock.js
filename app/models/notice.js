var mongoose = require('mongoose')
  , Schema = mongoose.Schema;

var noticeSchema = new Schema({
  'text': String
});

// Static methods

noticeSchema.statics.getAll = function(callback) {
  this.find().exec(callback);
};

mongoose.model('Notice', noticeSchema);
