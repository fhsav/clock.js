let mongoose = require('mongoose');
let express = require('express');
let Theme = mongoose.model('Theme')
  , Schedule = mongoose.model('Schedule')
  , Marquee = mongoose.model('Marquee')
  , Notice = mongoose.model('Notice')
  , User = mongoose.model('User');

let router = express.Router();

router.get(/.*/, (req, res, next) => {
  // Generate data for views
  res.locals.authenticated = req.session.authenticated;
  res.locals.appVersion = require(`${__dirname}/../../package.json`).version;

  User.getActive((err, user) => {
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

router.get('/', (req, res) => {
  res.render('admin/welcome');
});

router.get('/setup', (req, res) => {
  User.getActive((err, user) => {
    if (user) {
      res.status(403);
      res.render(`${__dirname}/../views/403`);
      return;
    }
    res.render('admin/setup');
  });
});

router.post('/setup', (req, res) => {
  User.getActive((err, user) => {
    if (user) {
      res.status(403);
      res.render(`${__dirname}/../views/403`);
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

router.post('/login', (req, res) => {
  User.getActive((err, user) => {
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

router.get('/logout', (req, res) => {
  req.session.authenticated = false;
  req.flash('success', 'Bye bye!');
  res.redirect('/admin');
});

router.get('/refresh', (req, res) => {
  req.app.locals.io.emit('refresh');
  res.redirect(req.header('Referer') || '/admin');
});

let themesRoute = require(`${__dirname}/themes`);
let schedulesRoute = require(`${__dirname}/schedules`);
let marqueeRoute = require(`${__dirname}/marquee`);
let noticesRoute = require(`${__dirname}/notices`);

router.use('/themes', themesRoute);
router.use('/schedules', schedulesRoute);
router.use('/marquee', marqueeRoute);
router.use('/notices', noticesRoute);

module.exports = router;
