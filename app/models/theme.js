var fs = require('fs');
var mongoose = require('mongoose')
  , Schema = require('mongoose').Schema;
var Grid = require('gridfs-stream');

var themeSchema = new Schema({
  'active': { type: Boolean, default: false },
  'name': String,
  'wallpaper': String,
  'created_at': { type: Date, default: Date.now },
  'updated_at': { type: Date, default: Date.now }
});

// Static Methods

themeSchema.statics.getAll = function(callback) {
  this.find().exec(callback);
};

themeSchema.statics.getActive = function(callback) {
  this.findOne({ active: true }, callback);
};

themeSchema.statics.uploadWallpaper = function(wallpaper, callback) {
  var gfs = Grid(mongoose.connection.db);

  var writestream = gfs.createWriteStream({
    filename: 'uploads/' + wallpaper.name,
    mode: 'w',
    content_type: wallpaper.type
  });
  fs.createReadStream(wallpaper.path).pipe(writestream);

  writestream.on('close', function(file) {
    callback(null);
  });
};

themeSchema.statics.getWallpaperStreamOfActive = function(callback) {
  this.getActive(function(err, activeTheme) {
    if (err) throw err;
    if (activeTheme == null) {
      callback(new Error('No active theme'));
    } else {
      activeTheme.createWallpaperStream(callback);
    }
  });
};

themeSchema.statics.createWallpaperStream = function(wallpaperID, callback) {
  var gfs = Grid(mongoose.connection.db);
  var readStream = gfs.createReadStream({
    _id: wallpaperID
  });
  callback(null, readStream);
};

// Instance methods

themeSchema.methods.activate = function(callback) {
  var self = this;

  this.model('Theme').update({active: true}, { $set: {active: false} }, {multi: true}, function(err) {
    if (err) callback(err);
    self.active = true;
    self.save(callback);
  });
};

/**
 * Create a wallpaper stream from the theme
 */
themeSchema.methods.createWallpaperStream = function(callback) {
  var self = this;

  this.getWallpaperID(function(err, wallpaperID) {
    if (err) throw err;
    self.model('Theme').createWallpaperStream(wallpaperID, callback);
  });
};

/**
 * Since themes.wallpaper is the filename, this method is necessary to get the
 * ID.
 */
themeSchema.methods.getWallpaperID = function(callback) {
  var gfs = Grid(mongoose.connection.db);
  gfs.files.findOne({filename: 'uploads/' + this.wallpaper}, function(err, wallpaper) {
    callback(err, wallpaper._id);
  });
};

mongoose.model('Theme', themeSchema);
