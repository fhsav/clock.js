var express = require('express');
var mongoose = require('mongoose');
var Notice = mongoose.model('Notice');
var sessionManager = require(__dirname + '/sessionManager');

var router = express.Router();

router.get('/', function(req, res, next) {
  var data = sessionManager.getViewData(req);

  Notice.getAll(function(err, notices) {
    data.notices = notices;
    res.render('admin/pages/notices', data);
  });
});

router.param('notice', function(req, res, next, id) {
  Notice.findById(id, function (err, notice) {
    if (err) return next(err);

    req.notice = notice;
    next();
  });
});

router.post('/create', function(req, res, next) {
  Notice.create({
    'text': req.body.notice.text
  }, redirectToLanding);

  function redirectToLanding(err) {
    if (err) throw err;
    res.redirect('/admin/notices');
  }
});

router.get('/:notice/delete', function(req, res, next) {
  req.notice.remove(function (err) {
    if (err) throw err;
    res.redirect('/admin/notices');
  });
});

router.get('/:notice/edit', function(req, res, next) {
  var data = session.getViewData(req);
  data.notice = req.notice;

  res.render('admin/edit/notice', data);
});

router.post('/:notice/edit', function(req, res, next) {
  req.notice.text = req.body.notice.text;

  req.notice.save(function(err) {
    if (err) throw err;

    res.redirect('/admin/notices');
  });
});

module.exports = router;