var moment = require('moment');
var async = require('async');

function Clock() {}

Clock.prototype.setRoutes = function(app) {
  app.get('/', this.index.bind(this) );
};

Clock.prototype.setModules = function(modules) {
  this.Themes = modules.Themes;
  this.Schedules = modules.Schedules;
  this.Marquee = modules.Marquee;
  this.Notices = modules.Notices;
  this.Periods = modules.Periods;
};

Clock.prototype.index = function(req, res) {
  var self = this;

  async.parallel({

    // Get periods in parallel with marquees
    'periods': function(callback) {
      self.Schedules.getActive(getPeriods);

      function getPeriods(err, schedule) {
        self.Periods.getAllByScheduleID(schedule._id, parsePeriods);
      }

      function parsePeriods(err, periods) {
        for (var i = 0; i < periods.length; i++) {
          periods[i].start = self.Periods.normalizeTime(periods[i].start);
          periods[i].finish = self.Periods.normalizeTime(periods[i].finish);
          periods[i].startDatetime = self.Periods.normalizeForDatetime(periods[i].start);
          periods[i].finishDatetime = self.Periods.normalizeForDatetime(periods[i].finish);
        }
        callback(err, periods);
      }
    },

    // Now get marquees in parallel
    'marquees': function(callback){
      self.Marquee.getAll(callback);
    },

    'notices': function(callback) {
      self.Notices.getAll(callback);
    }
  },

  // We've got periods, marquees, and notices. Render.
  function(err, results) {
    res.render('clock', results);
  });
};

module.exports = new Clock();
