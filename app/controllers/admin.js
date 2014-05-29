var mongoose = require('mongoose');
var express = require('express');
var Theme = mongoose.model('Theme')
  , Schedule = mongoose.model('Schedule')
  , Marquee = mongoose.model('Marquee')
  , Notice = mongoose.model('Notice')
  , System = require(__dirname + '/../models/system.js');
var crypto = require('crypto');

var router = express.Router();

var themesRoute = require(__dirname + '/themes');
var schedulesRoute = require(__dirname + '/schedules');
var marqueeRoute = require(__dirname + '/marquee');
var noticesRoute = require(__dirname + '/notices');

router.get(/.*/, function(req, res, next) {
  // Generate data for views
  res.locals.viewData = {};
  res.locals.viewData.authenticated = req.session.authenticated;
  res.locals.viewData.version = '0.3.0';
  res.locals.viewData.successes = req.flash('success');
  res.locals.viewData.errors = req.flash('error');
  res.locals.viewData.warnings = req.flash('warning');

  if (!System.isConfigured() && req.url != '/setup') {
    // Check if we need to do one-time setup
    req.flash('warning', 'Y\'all need to give me your password first.');
    res.redirect('/admin/setup');
  } else if (!req.session.authenticated && System.isConfigured()) {
    res.render('admin/login', res.locals.viewData);
  } else {
    next();
  }
});

router.get('/', function(req, res) {
  res.render('admin/welcome', res.locals.viewData);
});

router.get('/setup', function(req, res) {
  res.render('admin/setup', res.locals.viewData);
});

router.post('/setup', function(req, res) {
  System.setPassword(req.body.password, function(err, reply) {
    res.redirect('/admin');
  });
});

router.post('/login', function(req, res) {
  System.validatePassword(req.body.password, function(err) {
    if (err) {
      req.flash('error', 'You\'re an idiot. You can\'t remember your own password?');
    } else {
      req.flash('success', 'Welcome back!');
      req.session.authenticated = true;
    }
    res.redirect('/admin');
  });
});

router.get('/logout', function(req, res) {
  req.session.authenticated = false;
  req.flash('success', 'Bye bye!');
  res.redirect('/admin');
});

router.use('/themes', themesRoute);
router.use('/schedules', schedulesRoute);
router.use('/marquee', marqueeRoute);
router.use('/notices', noticesRoute);

module.exports = router;