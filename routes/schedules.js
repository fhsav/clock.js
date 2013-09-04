function Schedules() {}

Schedules.prototype.setModules = function(modules) {
  this.Themes = modules.Themes;
  this.Schedules = modules.Schedules;
  this.Marquee = modules.Marquee;
  this.Notices = modules.Notices;
  this.Periods = modules.Periods;
};

Schedules.prototype.activate = function(req, res) {
  this.Schedules.activate(req.params.objectID, function(err) {
    if (err) throw err;
    res.redirect('/admin/schedules');
  });
};

module.exports = new Schedules();