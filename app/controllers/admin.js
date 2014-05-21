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

router.get(/.*/, function(req, res, next) {
  // Generate data for views
  res.locals.viewData = {};
  res.locals.viewData.authenticated = req.session.authenticated;
  res.locals.viewData.version = '0.3.0';
  res.locals.viewData.successes = req.flash('success');
  res.locals.viewData.errors = req.flash('error');

  // Make sure user is logged in
  if (!req.session.authenticated) {
    res.render('admin/login', res.locals.viewData);
  } else {
    next();
  }
});

router.get('/', function(req, res) {
  res.render('admin/welcome', res.locals.viewData);
});

router.post('/login', function(req, res) {
  if (req.body.password == 'penguins') {
    req.session.authenticated = true;
    req.flash('success', 'Welcome back!');
    res.redirect('/admin');
  } else {
    req.flash('error', 'You\'re an idiot. You can\'t remember your own password?');
    res.redirect('/admin');
  }
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