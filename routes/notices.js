var ObjectID = require('mongodb').ObjectID;

function Notices() {}

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

module.exports = new Notices();