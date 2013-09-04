function Clock() {}

Clock.prototype.setModules = function(modules) {
  this.Themes = modules.Themes;
  this.Schedules = modules.Schedules;
  this.Marquee = modules.Marquee;
  this.Notices = modules.Notices;
  this.Periods = modules.Periods;
};

Clock.prototype.index = function(req, res) {
  var self = this;

  self.Schedules.getActive(function(err, schedule) {
    self.Periods.getAllByScheduleID(schedule[0]._id, function(err, periods) {
      res.render('clock', {
        schedule: schedule,
        periods: periods
      });
    });
  });
};

module.exports = new Clock();