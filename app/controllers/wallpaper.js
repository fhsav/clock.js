let express = require('express');
let mongoose = require('mongoose');
let Theme = mongoose.model('Theme');

let router = express.Router();

router.get('/active', (req, res) => {
  Theme.getWallpaperStreamOfActive(function(err, wallpaperStream) {
    if (err && err.message == 'No active theme') {
      res.status(404);
      res.end();
    } else {
      wallpaperStream.pipe(res);
    }
  });
});

router.param('wallpaper', (req, res, next, id) => {
  Theme.createWallpaperStream(id, (err, wallpaperStream) => {
    if (err) return next(err);
    req.wallpaperStream = wallpaperStream;
    next();
  });
});

router.get('/:wallpaper', (req, res) => {
  req.wallpaperStream.pipe(res);
});

module.exports = router;
