var crypto = require('crypto');
var mongoose = require('mongoose');
var express = require('express');
var Theme = mongoose.model('Theme')
  , Schedule = mongoose.model('Schedule')
  , Marquee = mongoose.model('Marquee')
  , Notice = mongoose.model('Notice')
  , User = mongoose.model('User');
var package = require(__dirname + '/../../package.json');

var router = express.Router();

router.get(/.*/, function(req, res, next) {
  // Generate data for views
  res.locals.viewData = {};
  res.locals.viewData.authenticated = req.session.authenticated;
  res.locals.viewData.version = package.version;
  res.locals.viewData.successes = req.flash('success');
  res.locals.viewData.errors = req.flash('error');
  res.locals.viewData.warnings = req.flash('warning');

  User.getActive(function(err, user) {
    // Check if we need to do one-time setup
    if (!user && req.url != '/setup') {
      req.flash('warning', 'Y\'all need to give me your password first.');
      res.redirect('/admin/setup');
    } else if (!req.session.authenticated && user) {
      res.render('admin/login', res.locals.viewData);
    } else {
      next();
    }
  });
});

router.get('/', function(req, res) {
  res.render('admin/welcome', res.locals.viewData);
});

router.get('/setup', function(req, res) {
  res.render('admin/setup', res.locals.viewData);
});

router.post('/setup', function(req, res) {
  var user = User.getActive();
  if (user) {
    // Send 403 here
    return;
  }

  User.create({
    'active': true,
    'name': 'Default',
    'password': User.provideHash(req.body.password)
  }, redirectToLanding);

  function redirectToLanding(err) {
    if (err) throw err;
    res.redirect('/admin');
  }
});

router.post('/login', function(req, res) {
  User.getActive(function(err, user) {
    user.checkPassword(req.body.password, function(err) {
      if (err) {
        req.flash('error', 'You\'re an idiot. You can\'t remember your own password?');
      } else {
        req.flash('success', 'Welcome back!');
        req.session.authenticated = true;
      }
      res.redirect('/admin');
    });
  });
});

router.get('/logout', function(req, res) {
  req.session.authenticated = false;
  req.flash('success', 'Bye bye!');
  res.redirect('/admin');
});

var themesRoute = require(__dirname + '/themes');
var schedulesRoute = require(__dirname + '/schedules');
var marqueeRoute = require(__dirname + '/marquee');
var noticesRoute = require(__dirname + '/notices');

router.use('/themes', themesRoute);
router.use('/schedules', schedulesRoute);
router.use('/marquee', marqueeRoute);
router.use('/notices', noticesRoute);

module.exports = router;
