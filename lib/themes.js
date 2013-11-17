var ClockObject = require('./ClockObject.js');
var mongo = require('mongodb');
var MongoClient = require('mongodb').MongoClient;
var Grid = require('gridfs-stream');
var util = require('util');

function Themes() {
  this.collection = 'themes';
}

util.inherits(Themes, ClockObject);

// Overload setMongoDB for GridFS
Themes.prototype.setMongoDB = function(db) {
  this.db = db;
  this.collection = this.db.collection(this.collection);
  this.gfs = Grid(db, mongo);
};

Themes.prototype.activate = function(objectID, callback) {
  var self = this;

  self.update({active: true}, { $set: {active: false} }, {multi: true}, function(err) {
    self.update({_id: objectID}, { $set: {active: true} }, {}, function(err) {
      callback(err);
    });
  });
};

Themes.prototype.getActive = function(callback) {
  this.collection.findOne({active: true}, callback);
};

Themes.prototype.getThemeWallpaperFilename = function(objectID, callback) {
  this.getByObjectID(objectID, function(err, data) {
    callback(err, data.wallpaper);
  });
};

Themes.prototype.getThemeWallpaperID = function(objectID, callback) {
  var self = this;

  this.getThemeWallpaperFilename(objectID, function(err, wallpaper) {
    self.gfs.files.findOne({filename: 'uploads/' + wallpaper}, function(err, wallpaper) {
      callback(err, wallpaper._id);
    });
  });
};

Themes.prototype.getWallpaperStreamByFilename = function(filename) {
  return this.gfs.createReadStream({
    filename: filename
  });
};

Themes.prototype.getWallpaperStreamByID = function(objectID, callback) {
  var readStream = this.gfs.createReadStream({
    _id: objectID
  });

  callback(null, readStream);
};

Themes.prototype.getWallpaperStreamByThemeID = function(objectID, callback) {
  var self = this;

  this.getThemeWallpaperID(objectID, function(err, wallpaper_id) {
    self.getWallpaperStreamByID(wallpaper_id, callback);
  });
};

Themes.prototype.getActiveWallpaperStream = function(callback) {
  var self = this;

  this.getActive(function(err, activeWallpaper) {
    self.getWallpaperStreamByThemeID(activeWallpaper._id, callback);
  });
};

module.exports = new Themes();