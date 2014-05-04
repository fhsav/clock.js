var express = require('express');
var mongoose = require('mongoose');
var Schedule = mongoose.model('Schedule')
  , Period = mongoose.model('Period');
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

router.param('period', function(req, res, next, id) {
  Period.findById(id, function (err, period) {
    if (err) return next(err);

    req.period = period;
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

router.post('/:schedule/periods/create', function(req, res, next) {
  Period.create({
    'number': req.body.period.number,
    'text': req.body.period.text,
    'start': Period.parseTime(req.body.period.start),
    'finish': Period.parseTime(req.body.period.finish),
    'schedule_id': req.schedule._id
  }, redirectToLanding);

  function redirectToLanding(err) {
    if (err) throw err;
    res.redirect('/admin/schedules/' + req.params.schedule + '/edit');
  }
});

router.get('/:schedule/periods/:period/delete', function(req, res, next) {
  req.period.remove(function (err) {
    if (err) throw err;
    res.redirect('/admin/schedules/' + req.params.schedule + '/edit');
  });
});

router.get('/:schedule/periods/:period/edit', function(req, res, next) {
  var data = adminUtils.getViewData(req);
  data.scheduleID = req.params.scheduleID;
  data.period = req.period;
  res.render('admin/edit/period', data);
});

router.post('/:schedule/periods/:period/edit', function(req, res, next) {
  req.period.number = req.body.period.number;
  req.period.text = req.body.period.text;
  req.period.start = Period.parseTime(req.body.period.start);
  req.period.finish = Period.parseTime(req.body.period.finish);
  req.period.schedule_id = req.schedule._id;

  req.period.save(function(err) {
    if (err) throw err;
    res.redirect('/admin/schedules/' + req.params.schedule + '/edit');
  });
});

module.exports = router;