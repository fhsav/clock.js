var express = require('express');
var mongoose = require('mongoose');
var Theme = mongoose.model('Theme');
var sessionManager = require(__dirname + '/sessionManager');

var router = express.Router();

router.get('/', function(req, res, next) {
  Theme.getAll(function(err, themes) {
    res.locals.viewData.themes = themes;
    res.render('admin/themes/index', res.locals.viewData);
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
      req.flash('success', 'The theme has been created.');
      res.redirect('/admin/themes');
    }
  });
});

router.get('/:theme/activate', function(req, res, next) {
  req.theme.activate(function(err) {
    if (err) throw err;
    req.flash('success', 'The theme has been activated.');
    res.redirect('/admin/themes');
  });
});

router.get('/:theme/delete', function(req, res, next) {
  req.theme.remove(function (err) {
    if (err) throw err;
    req.flash('success', 'The theme has been destroyed.');
    res.redirect('/admin/themes');
  });
});

router.get('/:theme/preview', function(req, res, next) {
  res.locals.viewData.theme = req.theme;

  req.theme.getWallpaperID(function(err, wallpaperID) {
    res.locals.viewData.wallpaperID = wallpaperID;
    res.render('admin/themes/preview', res.locals.viewData);
  });
});

module.exports = router;