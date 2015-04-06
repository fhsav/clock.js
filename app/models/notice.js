let mongoose = require('mongoose')
  , Schema = mongoose.Schema;

let noticeSchema = new Schema({
  'text': String,
  'created_at': { type: Date, default: Date.now },
  'updated_at': { type: Date, default: Date.now }
});

// Static methods

noticeSchema.statics.getAll = function(callback) {
  this.find().exec(callback);
};

mongoose.model('Notice', noticeSchema);
