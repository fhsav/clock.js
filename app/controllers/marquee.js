var express = require('express');
var mongoose = require('mongoose');
var Marquee = mongoose.model('Marquee');
var sessionManager = require(__dirname + '/sessionManager');

var router = express.Router();

router.get('/', function(req, res, next) {
  Marquee.getAll(function(err, marquees) {
    res.locals.viewData.marquees = marquees;
    res.render('admin/marquee/index', res.locals.viewData);
  });
});

router.param('marquee', function(req, res, next, id) {
  Marquee.findById(id, function (err, marquee) {
    if (err) return next(err);

    req.marquee = marquee;
    next();
  });
});

router.post('/create', function(req, res, next) {
  Marquee.create({
    'text': req.body.marquee.text
  }, redirectToLanding);

  function redirectToLanding(err) {
    if (err) throw err;
    req.flash('success', 'The marquee has been created.');
    res.redirect('/admin/marquee');
  }
});

router.get('/:marquee/delete', function(req, res, next) {
  req.marquee.remove(function (err) {
    if (err) throw err;
    req.flash('success', 'The marquee has been destroyed.');
    res.redirect('/admin/marquee');
  });
});

router.get('/:marquee/edit', function(req, res, next) {
  res.locals.viewData.marquee = req.marquee;
  res.render('admin/marquee/edit', res.locals.viewData);
});

router.post('/:marquee/edit', function(req, res, next) {
  req.marquee.text = req.body.marquee.text;

  req.marquee.save(function(err) {
    if (err) throw err;
    req.flash('success', 'The marquee has been modified.');
    res.redirect('/admin/marquee');
  });
});

module.exports = router;