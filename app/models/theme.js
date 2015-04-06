let fs = require('fs');
let mongoose = require('mongoose')
  , Schema = require('mongoose').Schema;
let Grid = require('gridfs-stream');

let themeSchema = new Schema({
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
  let gfs = Grid(mongoose.connection.db);

  let writestream = gfs.createWriteStream({
    filename: 'uploads/' + wallpaper.name,
    mode: 'w',
    content_type: wallpaper.type
  });
  fs.createReadStream(wallpaper.path).pipe(writestream);

  writestream.on('close', (file) => {
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
  let gfs = Grid(mongoose.connection.db);
  let readStream = gfs.createReadStream({
    _id: wallpaperID
  });
  callback(null, readStream);
};

// Instance methods

themeSchema.methods.activate = function(callback) {
  this.model('Theme').update({active: true}, { $set: {active: false} }, {multi: true}, (err) => {
    if (err) callback(err);
    this.active = true;
    this.save(callback);
  });
};

/**
 * Create a wallpaper stream from the theme
 */
themeSchema.methods.createWallpaperStream = function(callback) {
  this.getWallpaperID((err, wallpaperID) => {
    if (err) throw err;
    this.model('Theme').createWallpaperStream(wallpaperID, callback);
  });
};

/**
 * Since themes.wallpaper is the filename, this method is necessary to get the
 * ID.
 */
themeSchema.methods.getWallpaperID = function(callback) {
  let gfs = Grid(mongoose.connection.db);
  gfs.files.findOne({filename: 'uploads/' + this.wallpaper}, (err, wallpaper) => {
    callback(err, wallpaper._id);
  });
};

mongoose.model('Theme', themeSchema);
