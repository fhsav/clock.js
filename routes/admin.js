function Admin() {}

Admin.prototype.setModules = function(modules) {
  this.Admin = modules.Admin;
  this.Themes = modules.Themes;
  this.Schedules = modules.Schedules;
  this.Marquee = modules.Marquee;
  this.Notices = modules.Notices;
  this.Periods = modules.Periods;
};

Admin.prototype.welcome = function(req, res) {
  res.render('admin/pages/welcome', this.Admin.getViewData(req));
};

Admin.prototype.logout = function(req, res) {
  req.session.loggedIn = false;
  res.redirect('/admin');
};

Admin.prototype.login_post = function(req, res) {
  if (req.body.password == 'penguins') {
    req.session.loggedIn = true;
  }
  res.redirect('/admin');
};

module.exports = new Admin();