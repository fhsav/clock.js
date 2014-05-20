var express = require('express');
var mongoose = require('mongoose');
var Theme = mongoose.model('Theme');
var adminUtils = require(__dirname + '/adminUtils');

var router = express.Router();

router.get('/', function(req, res, next) {
  var data = adminUtils.getViewData(req);

  Theme.getAll(function(err, themes) {
    data.themes = themes;
    res.render('admin/pages/themes', data);
  });
});

router.param('theme', function(req, res, next, id) {
  Theme.findById(id, function (err, theme) {
    if (err) return next(err);

    req.theme = theme;
    next();
  });
});

router.post('/create', function(req, res, next) {
  Theme.uploadWallpaper(req.files['theme[wallpaper]'], function(err) {
    if (err) throw err;

    Theme.create({
      'name': req.body['theme[name]'],
      'wallpaper': req.files['theme[wallpaper]'].name
    }, redirectToLanding);

    function redirectToLanding(err) {
      if (err) throw err;
      res.redirect('/admin/themes');
    }
  });
});

router.get('/:theme/activate', function(req, res, next) {
  req.theme.activate(function(err) {
    if (err) throw err;
    res.redirect('/admin/themes');
  });
});

router.get('/:theme/delete', function(req, res, next) {
  req.theme.remove(function (err) {
    if (err) throw err;
    res.redirect('/admin/themes');
  });
});

router.get('/:theme/preview', function(req, res, next) {
  var data = adminUtils.getViewData(req);
  data.theme = req.theme;

  req.theme.getWallpaperID(function(err, wallpaperID) {
    data.wallpaperID = wallpaperID;
    res.render('admin/pages/preview', data);
  });
});

module.exports = router;