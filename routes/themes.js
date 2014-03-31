var ObjectID = require('mongodb').ObjectID;

function Themes() {}

Themes.prototype.setRoutes = function(app) {
  app.get('/admin/themes', this.landing.bind(this) );
  app.post('/themes/create', this.create.bind(this) );
  app.get('/themes/:objectID/activate', this.activate.bind(this) );
  app.get('/themes/:objectID/delete', this.remove.bind(this) );

  app.get('/themes/wallpaper/active', this.wallpaperActive.bind(this) );
  app.get('/themes/wallpaper/:objectID', this.wallpaper.bind(this) );
  app.get('/themes/:objectID/preview', this.preview.bind(this) );
};

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

Themes.prototype.create = function(req, res) {
  this.Themes.create(req.body.theme.name, req.files.theme.wallpaper, function(err) {
    if (err) throw err;
    res.redirect('/admin/themes');
  });
};

Themes.prototype.activate = function(req, res) {
  this.Themes.activate(new ObjectID(req.params.objectID), function(err) {
    if (err) throw err;
    res.redirect('/admin/themes');
  });
};

Themes.prototype.remove = function(req, res) {
  this.Themes.remove(new ObjectID(req.params.objectID), false, function(err, numberRemoved) {
    if (err) throw err;
    res.redirect('/admin/themes');
  });
};

Themes.prototype.wallpaper = function(req, res) {
  console.log(req.params);
  this.Themes.getWallpaperStreamByThemeID(new ObjectID(req.params.objectID), function(err, wallpaperStream) {
    wallpaperStream.pipe(res);
  });
};

Themes.prototype.wallpaperActive = function(req, res) {
  this.Themes.getActiveWallpaperStream(function(err, wallpaperStream) {
    wallpaperStream.pipe(res);
  });
};

Themes.prototype.preview = function(req, res) {
  var data = this.Admin.getViewData(req);

  data.theme = {};
  data.theme._id = req.params.objectID;
  res.render('admin/pages/preview', data);
};

module.exports = new Themes();
