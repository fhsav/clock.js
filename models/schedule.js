var mongoose = require('mongoose')
  , Schema = mongoose.Schema;
var Period = mongoose.model('Period');

var scheduleSchema = new Schema({
  'active': Boolean,
  'name': String,
  'description': String,
  'created_at': { type: Date, default: Date.now },
  'updated_at': { type: Date, default: Date.now }
});

// Static methods

scheduleSchema.statics.getAll = function(callback) {
  this.find().exec(callback);
};

scheduleSchema.statics.getActive = function(callback) {
  this.findOne({ active: true }, callback);
};

// Instance methods

scheduleSchema.methods.getPeriods = function(callback) {
  Period.find({ schedule_id: this._id }).sort({ number: 1 }).exec(callback);
}

scheduleSchema.methods.activate = function(callback) {
  var self = this;

  this.model('Schedule').update({active: true}, { $set: {active: false} }, {multi: true}, function(err) {
    if (err) callback(err);

    self.active = true;
    self.save(callback);
  });
};

mongoose.model('Schedule', scheduleSchema);