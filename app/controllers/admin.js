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
  res.locals.authenticated = req.session.authenticated;
  res.locals.appVersion = package.version;
  res.locals.successes = req.flash('success');
  res.locals.errors = req.flash('error');
  res.locals.warnings = req.flash('warning');

  User.getActive(function(err, user) {
    // Check if we need to do one-time setup
    if (!user && req.url != '/setup') {
      req.flash('warning', 'Y\'all need to give me your password first.');
      res.redirect('/admin/setup');
    } else if (!req.session.authenticated && user) {
      res.render('admin/login');
    } else {
      next();
    }
  });
});

router.get('/', function(req, res) {
  res.render('admin/welcome');
});

router.get('/setup', function(req, res) {
  User.getActive(function(err, user) {
    if (user) {
      res.status(403);
      res.render(__dirname + '/../views/403');
      return;
    }
    res.render('admin/setup');
  });
});

router.post('/setup', function(req, res) {
  User.getActive(function(err, user) {
    if (user) {
      res.status(403);
      res.render(__dirname + '/../views/403');
      return;
    }
    User.create({
      'active': true,
      'name': 'Default',
      'password': User.provideHash(req.body.password)
    }, redirectToLanding);
  });

  function redirectToLanding(err) {
    if (err) throw err;
    res.redirect('/admin');
  }
});

router.post('/login', function(req, res) {
  User.getActive(function(err, user) {
    user.checkPassword(req.body.password, checkPassword);
  });

  function checkPassword(err) {
    if (err) {
      req.flash('error', 'You\'re an idiot. You can\'t remember your own password?');
    } else {
      req.flash('success', 'Welcome back!');
      req.session.authenticated = true;
    }
    res.redirect('/admin');
  }
});

router.get('/logout', function(req, res) {
  req.session.authenticated = false;
  req.flash('success', 'Bye bye!');
  res.redirect('/admin');
});

router.get('/refresh', function(req, res) {
  req.app.locals.io.emit('refresh');
  res.redirect(req.header('Referer') || '/admin');
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
