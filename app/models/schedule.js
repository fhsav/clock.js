let mongoose = require('mongoose')
  , Schema = mongoose.Schema;
let Period = mongoose.model('Period');

let scheduleSchema = new Schema({
  'active': { type: Boolean, default: false },
  'name': String,
  'description': String,
  'created_at': { type: Date, default: Date.now },
  'updated_at': { type: Date, default: Date.now },
  'periods': [Period.schema]
});

// Static methods

scheduleSchema.statics.getAll = function(callback) {
  this.find().exec(callback);
};

scheduleSchema.statics.getActive = function(callback) {
  this.findOne({ active: true }, callback);
};

// Instance methods

scheduleSchema.methods.activate = function(callback) {
  this.model('Schedule').update({active: true}, { $set: {active: false} }, {multi: true}, (err) => {
    if (err) callback(err);
    this.active = true;
    this.save(callback);
  });
};

scheduleSchema.methods.deactivate = function(callback) {
  this.active = false;
  this.save(callback);
};

mongoose.model('Schedule', scheduleSchema);
