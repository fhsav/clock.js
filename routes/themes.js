var ObjectID = require('mongodb').ObjectID;

function Themes() {}

Themes.prototype.setModules = function(modules) {
  this.Themes = modules.Themes;
  this.Schedules = modules.Schedules;
  this.Marquee = modules.Marquee;
  this.Notices = modules.Notices;
  this.Periods = modules.Periods;
};

Themes.prototype.activate = function(req, res) {
  this.Themes.activate(new ObjectID(req.params.objectID), function(err) {
    if (err) throw err;
    res.redirect('/admin/themes');
  });
};

module.exports = new Themes();