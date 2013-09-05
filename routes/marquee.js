var ObjectID = require('mongodb').ObjectID;

function Marquee() {}

Marquee.prototype.setModules = function(modules) {
  this.Admin = modules.Admin;
  this.Themes = modules.Themes;
  this.Schedules = modules.Schedules;
  this.Marquee = modules.Marquee;
  this.Notices = modules.Notices;
  this.Periods = modules.Periods;
};

Marquee.prototype.landing = function(req, res) {
  var data = this.Admin.getViewData(req);

  this.Marquee.getAll(function(err, marquees) {
    data.marquees = marquees;
    res.render('admin/pages/marquee', data);
  });
};

module.exports = new Marquee();