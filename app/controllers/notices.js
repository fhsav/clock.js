var express = require('express');
var mongoose = require('mongoose');
var Notice = mongoose.model('Notice');

var router = express.Router();

router.get('/', function(req, res) {
  Notice.getAll(function(err, notices) {
    res.locals.viewData.notices = notices;
    res.render('admin/notices/index', res.locals.viewData);
  });
});

router.param('notice', function(req, res, next, id) {
  Notice.findById(id, function (err, notice) {
    if (err) return next(err);

    req.notice = notice;
    next();
  });
});

router.post('/create', function(req, res) {
  Notice.create({
    'text': req.body.notice.text
  }, redirectToLanding);

  function redirectToLanding(err) {
    if (err) throw err;
    req.flash('success', 'The notice has been created.');
    res.redirect('/admin/notices');
  }
});

router.get('/:notice/delete', function(req, res) {
  req.notice.remove(function (err) {
    if (err) throw err;
    req.flash('success', 'The notice has been destroyed.');
    res.redirect('/admin/notices');
  });
});

router.get('/:notice/edit', function(req, res) {
  res.locals.viewData.notice = req.notice;
  res.render('admin/notice/edit', res.locals.viewData);
});

router.post('/:notice/edit', function(req, res) {
  req.notice.text = req.body.notice.text;

  req.notice.save(function(err) {
    if (err) throw err;
    req.flash('success', 'The notice has been modified.');
    res.redirect('/admin/notices');
  });
});

module.exports = router;