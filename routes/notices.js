var ObjectID = require('mongodb').ObjectID;

function Notices() {}

Notices.prototype.setRoutes = function(app) {
  app.get('/admin/notices', this.landing.bind(this) );
  app.post('/notices/create', this.create.bind(this) );
  app.get('/notices/:objectID/edit', this.edit.bind(this) );
  app.post('/notices/:objectID/edit', this.edit_post.bind(this) );
  app.get('/notices/:objectID/delete', this.remove.bind(this) );
};

Notices.prototype.setModules = function(modules) {
  this.Admin = modules.Admin;
  this.Themes = modules.Themes;
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

Notices.prototype.edit = function(req, res) {
  var data = this.Admin.getViewData(req);

  this.Notices.getByObjectID(new ObjectID(req.params.objectID), function(err, notice) {
    data.notice = notice;
    res.render('admin/edit/notices', data);
  });
};

Notices.prototype.edit_post = function(req, res) {
  this.Notices.updateText(new ObjectID(req.params.objectID), req.body.text, function(err) {
    if (err) throw err;
    res.redirect('/admin/notices');
  });
};

Notices.prototype.remove = function(req, res) {
  this.Notices.remove(new ObjectID(req.params.objectID), false, function(err, numberRemoved) {
    if (err) throw err;
    res.redirect('/admin/notices');
  });
};

module.exports = new Notices();
