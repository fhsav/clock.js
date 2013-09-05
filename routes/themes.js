var ObjectID = require('mongodb').ObjectID;

function Themes() {}

Themes.prototype.setModules = function(modules) {
  this.Admin = modules.Admin;
  this.Themes = modules.Themes;
  this.Schedules = modules.Schedules;
  this.Marquee = modules.Marquee;
  this.Notices = modules.Notices;
  this.Periods = modules.Periods;
};

Themes.prototype.landing = function(req, res) {
  var data = this.Admin.getViewData(req);

  this.Themes.getAll(function(err, themes) {
    data.themes = themes;
    res.render('admin/pages/themes', data);
  });
};

Themes.prototype.activate = function(req, res) {
  this.Themes.activate(new ObjectID(req.params.objectID), function(err) {
    if (err) throw err;
    res.redirect('/admin/themes');
  });
};

Themes.prototype.wallpaper = function(req, res) {
  var wallpaperStream = this.Themes.getWallpaperStream(new ObjectID(req.params.objectID));
  wallpaperStream.pipe(res);
};

module.exports = new Themes();