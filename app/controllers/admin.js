var mongoose = require('mongoose');
var express = require('express');
var Theme = mongoose.model('Theme')
  , Schedule = mongoose.model('Schedule')
  , Marquee = mongoose.model('Marquee')
  , Notice = mongoose.model('Notice');
var sessionManager = require(__dirname + '/sessionManager');
var crypto = require('crypto');

var router = express.Router();

var themesRoute = require(__dirname + '/themes');
var schedulesRoute = require(__dirname + '/schedules');
var marqueeRoute = require(__dirname + '/marquee');
var noticesRoute = require(__dirname + '/notices');

router.get('/', function(req, res, next) {
  res.render('admin/pages/welcome', sessionManager.getViewData(req));
});

router.post('/login', function(req, res, next) {
  if (req.body.password == 'penguins') {
    req.session.loggedIn = true;
    res.redirect('/admin');
  } else {
    res.redirect('/admin');
  }
});

router.get('/logout', function(req, res, next) {
  req.session.destroy(function(err) {
    if (err) throw err;
    res.redirect('/admin');
  });
});

router.use('/themes', themesRoute);
router.use('/schedules', schedulesRoute);
router.use('/marquee', marqueeRoute);
router.use('/notices', noticesRoute);

module.exports = router;