var ObjectID = require('mongodb').ObjectID;

function Schedules() {}

Schedules.prototype.setRoutes = function(app) {
  app.get('/admin/schedules', this.landing.bind(this) );
  app.post('/schedules/create', this.create.bind(this) );
  app.get('/schedules/:objectID/activate', this.activate.bind(this) );
  app.get('/schedules/:objectID/edit', this.edit.bind(this) );
  app.post('/schedules/:objectID/edit', this.edit_post.bind(this) );
  app.get('/schedules/:objectID/delete', this.remove.bind(this) );

  app.post('/schedules/:objectID/periods/create', this.createPeriod.bind(this) );
  app.get('/schedules/:scheduleID/periods/:periodID/edit', this.editPeriod.bind(this) );
  app.post('/schedules/:scheduleID/periods/:periodID/edit', this.editPeriod_post.bind(this) );
  app.get('/schedules/:scheduleID/periods/:periodID/delete', this.deletePeriod.bind(this) );
};

Schedules.prototype.setModules = function(modules) {
  this.Admin = modules.Admin;
  this.Themes = modules.Themes;
  this.Schedules = modules.Schedules;
  this.Marquee = modules.Marquee;
  this.Notices = modules.Notices;
  this.Periods = modules.Periods;
};

Schedules.prototype.landing = function(req, res) {
  var data = this.Admin.getViewData(req);

  this.Schedules.getAll(function(err, schedules) {
    data.schedules = schedules;
    res.render('admin/pages/schedules', data);
  });
};

Schedules.prototype.create = function(req, res) {
  this.Schedules.create(req.body.schedule.name, req.body.schedule.description, function(err) {
    if (err) throw err;
    res.redirect('/admin/schedules');
  });
};

Schedules.prototype.edit = function(req, res) {
  var self = this;
  var data = this.Admin.getViewData(req);

  this.Schedules.getByObjectID(new ObjectID(req.params.objectID), function(err, schedule) {
    self.Periods.getAllByScheduleID(new ObjectID(req.params.objectID), function (err, periods) {
      for (var i = 0; i < periods.length; i++) {
        periods[i].start = self.Periods.normalizeTime24(periods[i].start);
        periods[i].finish = self.Periods.normalizeTime24(periods[i].finish);
      }
      data.schedule = schedule;
      data.periods = periods;
      res.render('admin/edit/schedule', data);
    });
  });
};

Schedules.prototype.edit_post = function(req, res) {
  var data = {
    'name': req.body.schedule.name,
    'description': req.body.schedule.description,
  };

  this.Schedules.update({_id: new ObjectID(req.params.objectID)}, { $set: data }, {}, function(err) {
    if (err) throw err;
    res.redirect('/schedules/' + req.params.objectID + '/edit');
  });
};

Schedules.prototype.remove = function(req, res) {
  this.Schedules.remove(new ObjectID(req.params.objectID), false, function(err, numberRemoved) {
    if (err) throw err;
    res.redirect('/admin/schedules');
  });
};

Schedules.prototype.activate = function(req, res) {
  this.Schedules.activate(new ObjectID(req.params.objectID), function(err) {
    if (err) throw err;
    res.redirect('/admin/schedules');
  });
};

Schedules.prototype.createPeriod = function(req, res) {
  var scheduleID = new ObjectID(req.params.objectID);
  var number = req.body.period.number;
  var text = req.body.period.text;
  var start = this.Periods.parseTime(req.body.period.start);
  var finish = this.Periods.parseTime(req.body.period.finish);

  this.Periods.create(scheduleID, number, text, start, finish, function(err) {
    if (err) throw err;
    res.redirect('/schedules/' + req.params.objectID + '/edit');
  });
};

Schedules.prototype.editPeriod = function(req, res) {
  var self = this;
  var data = this.Admin.getViewData(req);

  this.Periods.getByObjectID(new ObjectID(req.params.periodID), function(err, period) {
    period.start = self.Periods.normalizeTime24(period.start);
    period.finish = self.Periods.normalizeTime24(period.finish);

    data.scheduleID = req.params.scheduleID;
    data.period = period;

    res.render('admin/edit/period', data);
  });
};

Schedules.prototype.editPeriod_post = function(req, res) {
  var data = {
    'scheduleID': new ObjectID(req.params.scheduleID),
    'number': req.body.period.number,
    'text': req.body.period.text,
    'start': this.Periods.parseTime(req.body.period.start),
    'finish': this.Periods.parseTime(req.body.period.finish)
  };

  this.Periods.update({_id: new ObjectID(req.params.periodID)}, { $set: data }, {}, function(err) {
    if (err) throw err;
    res.redirect('/schedules/' + req.params.scheduleID + '/edit');
  });
};

Schedules.prototype.deletePeriod = function(req, res) {
  this.Periods.remove(new ObjectID(req.params.periodID), false, function(err, numberRemoved) {
    if (err) throw err;
    res.redirect('/schedules/' + req.params.scheduleID + '/edit');
  });
};

module.exports = new Schedules();
