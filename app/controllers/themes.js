let express = require('express');
let mongoose = require('mongoose');
let Theme = mongoose.model('Theme');

let router = express.Router();

router.get('/', (req, res) => {
  Theme.getAll((err, themes) => {
    res.locals.themes = themes;
    res.render('admin/themes/index');
  });
});

router.param('theme', (req, res, next, id) => {
  Theme.findById(id, (err, theme) => {
    if (err) return next(err);
    req.theme = theme;
    next();
  });
});

router.post('/create', (req, res) => {
  Theme.uploadWallpaper(req.files['theme[wallpaper]'], (err) => {
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

router.get('/:theme/activate', (req, res) => {
  req.theme.activate((err) => {
    if (err) throw err;
    req.flash('success', 'The theme has been activated.');
    res.redirect('/admin/themes');
  });
});

router.get('/:theme/delete', (req, res) => {
  req.theme.remove((err) => {
    if (err) throw err;
    req.flash('success', 'The theme has been destroyed.');
    res.redirect('/admin/themes');
  });
});

router.get('/:theme/preview', (req, res) => {
  res.locals.theme = req.theme;

  req.theme.getWallpaperID((err, wallpaperID) => {
    res.locals.wallpaperID = wallpaperID;
    res.render('admin/themes/preview');
  });
});

module.exports = router;
