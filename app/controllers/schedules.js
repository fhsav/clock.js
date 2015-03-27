var express = require('express');
var mongoose = require('mongoose');
var Schedule = mongoose.model('Schedule')
  , Period = mongoose.model('Period');

var router = express.Router();

router.get('/', function(req, res) {
  Schedule.getAll(function(err, schedules) {
    res.locals.schedules = schedules;
    res.render('admin/schedules/index');
  });
});

router.param('schedule', function(req, res, next, id) {
  Schedule.findById(id, function (err, schedule) {
    if (err) return next(err);
    req.schedule = schedule;
    next();
  });
});

router.post('/create', function(req, res) {
  Schedule.create({
    'name': req.body.schedule.name,
    'description': req.body.schedule.description
  }, redirectToLanding);

  function redirectToLanding(err, schedule) {
    if (err) throw err;
    req.flash('success', 'The schedule has been created.');
    res.redirect('/admin/schedules/' + schedule.id + '/edit');
  }
});

router.get('/:schedule/activate', function(req, res) {
  req.schedule.activate(function(err) {
    if (err) throw err;
    req.flash('success', 'The schedule has been activated.');
    res.redirect('/admin/schedules');
  });
});

router.get('/:schedule/deactivate', function(req, res) {
  req.schedule.deactivate(function(err) {
    if (err) throw err;
    req.flash('success', 'The schedule has been deactivated.');
    res.redirect('/admin/schedules');
  });
});

router.get('/:schedule/delete', function(req, res) {
  req.schedule.remove(function (err) {
    if (err) throw err;
    req.flash('success', 'The schedule has been destroyed.');
    res.redirect('/admin/schedules');
  });
});

router.get('/:schedule/edit', function(req, res) {
  res.locals.schedule = req.schedule;
  res.locals.periods = req.schedule.periods;
  res.render('admin/schedules/edit');
});

router.post('/:schedule/edit', function(req, res) {
  req.schedule.name = req.body.schedule.name;
  req.schedule.description = req.body.schedule.description;

  req.schedule.save(function(err) {
    if (err) throw err;
    req.flash('success', 'The schedule has been modified.');
    res.redirect('/admin/schedules/' + req.params.schedule + '/edit');
  });
});

router.param('period', function(req, res, next, id) {
  req.period = req.schedule.periods.id(id);
  next();
});

router.post('/:schedule/periods/create', function(req, res) {
  req.schedule.periods.push({
    'number': req.body.period.number,
    'text': req.body.period.text,
    'start': Period.parseTime(req.body.period.start),
    'finish': Period.parseTime(req.body.period.finish)
  });

  req.schedule.save(function (err) {
    if (err) throw err;
    req.flash('success', 'The period has been created.');
    res.redirect('/admin/schedules/' + req.params.schedule + '/edit');
  });
});

router.get('/:schedule/periods/:period/delete', function(req, res) {
  req.schedule.periods.id(req.period.id).remove();
  req.schedule.save(function(err) {
    if (err) throw err;
    req.flash('success', 'The period has been destroyed.');
    res.redirect('/admin/schedules/' + req.params.schedule + '/edit');
  });
});

router.get('/:schedule/periods/:period/edit', function(req, res) {
  res.locals.schedule = req.schedule;
  res.locals.period = req.period;
  res.render('admin/schedules/edit_period');
});

router.post('/:schedule/periods/:period/edit', function(req, res) {
  var index = req.schedule.periods.indexOf(req.period);

  req.schedule.periods[index].number = req.body.period.number;
  req.schedule.periods[index].text = req.body.period.text;
  req.schedule.periods[index].start = Period.parseTime(req.body.period.start);
  req.schedule.periods[index].finish = Period.parseTime(req.body.period.finish);

  // Sorting of periods may have to be done here in the future.

  req.schedule.save(function(err) {
    if (err) throw err;
    req.flash('success', 'The schedule has been modified.');
    res.redirect('/admin/schedules/' + req.params.schedule + '/edit');
  });
});

module.exports = router;
