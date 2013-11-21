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

Marquee.prototype.create = function(req, res) {
  this.Marquee.create(req.body.marquee.text, function(err) {
    if (err) throw err;
    res.redirect('/admin/marquee');
  });
};

Marquee.prototype.edit = function(req, res) {
  var data = this.Admin.getViewData(req);

  this.Marquee.getByObjectID(new ObjectID(req.params.objectID), function(err, marquee) {
    data.marquee = marquee;
    res.render('admin/edit/marquee', data);
  });
};

Marquee.prototype.edit_post = function(req, res) {
  this.Marquee.updateText(new ObjectID(req.params.objectID), req.body.text, function(err) {
    if (err) throw err;
    res.redirect('/admin/marquee');
  });
};

Marquee.prototype.remove = function(req, res) {
  this.Marquee.remove(new ObjectID(req.params.objectID), false, function(err, numberRemoved) {
    if (err) throw err;
    res.redirect('/admin/marquee');
  });
};

module.exports = new Marquee();