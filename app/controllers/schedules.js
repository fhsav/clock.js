let express = require('express');
let mongoose = require('mongoose');
let Schedule = mongoose.model('Schedule')
  , Period = mongoose.model('Period');

let router = express.Router();

router.get('/', (req, res) => {
  Schedule.getAll((err, schedules) => {
    res.locals.schedules = schedules;
    res.render('admin/schedules/index');
  });
});

router.param('schedule', (req, res, next, id) => {
  Schedule.findById(id, (err, schedule) => {
    if (err) return next(err);
    req.schedule = schedule;
    next();
  });
});

router.post('/create', (req, res) => {
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

router.get('/:schedule/activate', (req, res) => {
  req.schedule.activate((err) => {
    if (err) throw err;
    req.flash('success', 'The schedule has been activated.');
    res.redirect('/admin/schedules');
  });
});

router.get('/:schedule/deactivate', (req, res) => {
  req.schedule.deactivate((err) => {
    if (err) throw err;
    req.flash('success', 'The schedule has been deactivated.');
    res.redirect('/admin/schedules');
  });
});

router.get('/:schedule/delete', (req, res) => {
  req.schedule.remove( (err) => {
    if (err) throw err;
    req.flash('success', 'The schedule has been destroyed.');
    res.redirect('/admin/schedules');
  });
});

router.get('/:schedule/edit', (req, res) => {
  res.locals.schedule = req.schedule;
  res.locals.periods = req.schedule.periods;
  res.render('admin/schedules/edit');
});

router.post('/:schedule/edit', (req, res) => {
  req.schedule.name = req.body.schedule.name;
  req.schedule.description = req.body.schedule.description;

  req.schedule.save((err) => {
    if (err) throw err;
    req.flash('success', 'The schedule has been modified.');
    res.redirect('/admin/schedules/' + req.params.schedule + '/edit');
  });
});

router.param('period', (req, res, next, id) => {
  req.period = req.schedule.periods.id(id);
  next();
});

router.post('/:schedule/periods/create', (req, res) => {
  req.schedule.periods.push({
    'number': req.body.period.number,
    'text': req.body.period.text,
    'start': Period.parseTime(req.body.period.start),
    'finish': Period.parseTime(req.body.period.finish)
  });

  req.schedule.save((err) => {
    if (err) throw err;
    req.flash('success', 'The period has been created.');
    res.redirect('/admin/schedules/' + req.params.schedule + '/edit');
  });
});

router.get('/:schedule/periods/:period/delete', (req, res) => {
  req.schedule.periods.id(req.period.id).remove();
  req.schedule.save((err) => {
    if (err) throw err;
    req.flash('success', 'The period has been destroyed.');
    res.redirect('/admin/schedules/' + req.params.schedule + '/edit');
  });
});

router.get('/:schedule/periods/:period/edit', (req, res) => {
  res.locals.schedule = req.schedule;
  res.locals.period = req.period;
  res.render('admin/schedules/edit_period');
});

router.post('/:schedule/periods/:period/edit', (req, res) => {
  let index = req.schedule.periods.indexOf(req.period);

  req.schedule.periods[index].number = req.body.period.number;
  req.schedule.periods[index].text = req.body.period.text;
  req.schedule.periods[index].start = Period.parseTime(req.body.period.start);
  req.schedule.periods[index].finish = Period.parseTime(req.body.period.finish);

  // Sorting of periods may have to be done here in the future.

  req.schedule.save((err) => {
    if (err) throw err;
    req.flash('success', 'The schedule has been modified.');
    res.redirect('/admin/schedules/' + req.params.schedule + '/edit');
  });
});

module.exports = router;
