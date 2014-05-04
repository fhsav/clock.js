var express = require('express');
var mongoose = require('mongoose');
var Schedule = mongoose.model('Schedule');
var adminUtils = require(__dirname + '/adminUtils');

var router = express.Router();

router.get('/', function(req, res, next) {
  var data = adminUtils.getViewData(req);

  Schedule.getAll(function(err, schedules) {
    data.schedules = schedules;
    res.render('admin/pages/schedules', data);
  });
});

router.param('schedule', function(req, res, next, id) {
  Schedule.findById(id, function (err, schedule) {
    if (err) return next(err);

    req.schedule = schedule;
    next();
  });
});

router.post('/create', function(req, res, next) {
  Schedule.create({
    'name': req.body.schedule.name,
    'description': req.body.schedule.description
  }, redirectToLanding);

  function redirectToLanding(err) {
    if (err) throw err;
    res.redirect('/admin/schedules');
  }
});

router.get('/:schedule/activate', function(req, res, next) {
  req.schedule.activate(function(err) {
    if (err) throw err;
    res.redirect('/admin/schedules');
  });
});

router.get('/:schedule/delete', function(req, res, next) {
  req.schedule.remove(function (err) {
    if (err) throw err;
    res.redirect('/admin/schedules');
  });
});

router.get('/:schedule/edit', function(req, res, next) {
  var data = adminUtils.getViewData(req);
  data.schedule = req.schedule;

  req.schedule.getPeriods(function(err, periods) {
    data.periods = periods;
    res.render('admin/edit/schedule', data);
  });
});

router.post('/:schedule/edit', function(req, res, next) {
  req.schedule.name = req.body.schedule.name;
  req.schedule.description = req.body.schedule.description;

  req.schedule.save(function(err) {
    if (err) throw err;

    res.redirect('/admin/schedules/' + req.params.schedule + '/edit');
  });
});

module.exports = router;