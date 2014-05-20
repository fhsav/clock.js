var express = require('express');
var mongoose = require('mongoose');
var Marquee = mongoose.model('Marquee');
var session = require(__dirname + '/session');

var router = express.Router();

router.get('/', function(req, res, next) {
  var data = session.getViewData(req);

  Marquee.getAll(function(err, marquees) {
    data.marquees = marquees;
    res.render('admin/pages/marquee', data);
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
    res.redirect('/admin/marquee');
  }
});

router.get('/:marquee/delete', function(req, res, next) {
  req.marquee.remove(function (err) {
    if (err) throw err;
    res.redirect('/admin/marquee');
  });
});

router.get('/:marquee/edit', function(req, res, next) {
  var data = session.getViewData(req);
  data.marquee = req.marquee;

  res.render('admin/edit/marquee', data);
});

router.post('/:marquee/edit', function(req, res, next) {
  req.marquee.text = req.body.marquee.text;

  req.marquee.save(function(err) {
    if (err) throw err;

    res.redirect('/admin/marquee');
  });
});

module.exports = router;