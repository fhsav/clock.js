var mongoose = require('mongoose')
  , Schema = mongoose.Schema;

var marqueeSchema = new Schema({
  'text': String,
  'created_at': { type: Date, default: Date.now },
  'updated_at': { type: Date, default: Date.now }
})

// Static methods

marqueeSchema.statics.getAll = function(callback) {
  this.find().exec(callback);
};

mongoose.model('Marquee', marqueeSchema);