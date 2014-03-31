var ObjectID = require('mongodb').ObjectID;

function Notices() {}

Notices.prototype.setRoutes = function(app) {
  app.get('/admin/notices', this.landing.bind(this) );
  app.post('/notices/create', this.create.bind(this) );
};

Notices.prototype.setModules = function(modules) {
  this.Admin = modules.Admin;
  this.Notices = modules.Notices;
  this.Schedules = modules.Schedules;
  this.Marquee = modules.Marquee;
  this.Notices = modules.Notices;
  this.Periods = modules.Periods;
};

Notices.prototype.landing = function(req, res) {
  var data = this.Admin.getViewData(req);

  this.Notices.getAll(function(err, notices) {
    data.notices = notices;
    res.render('admin/pages/notices', data);
  });
};

Notices.prototype.create = function(req, res) {
  this.Notices.create(req.body.notice.text, function(err) {
    if (err) throw err;
    res.redirect('/admin/notices');
  });
};

module.exports = new Notices();
