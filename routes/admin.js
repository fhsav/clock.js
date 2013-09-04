function Admin() {}

Admin.prototype.setModules = function(modules) {
  this.Themes = modules.Themes;
  this.Schedules = modules.Schedules;
  this.Marquee = modules.Marquee;
  this.Notices = modules.Notices;
  this.Periods = modules.Periods;
};

Admin.prototype.welcome = function(req, res) {
  res.render('admin', {
    loggedIn: req.session.loggedIn,
    version: '0.1.0'
  });
};

Admin.prototype.logout = function(req, res) {
  req.session.loggedIn = false;
  res.redirect('/admin');
};

Admin.prototype.page = function(req, res) {
  var data = {
    loggedIn: req.session.loggedIn,
    version: '0.1.0',
    page: req.params.page
  };

  if (req.params.page =='themes') {
    this.Themes.getAll(function(err, themes) {
      data.themes = themes;
      res.render('admin', data);
    });
  } else if (req.params.page == 'schedules') {
    this.Schedules.getAll(function(err, schedules) {
      data.schedules = schedules;
      res.render('admin', data);
    });
  } else if (req.params.page == 'marquee') {
    this.Marquee.getAll(function(err, marquees) {
      data.marquees = marquees;
      res.render('admin', data);
    });
  } else if (req.params.page == 'notices') {
    this.Notices.getAll(function(err, notices) {
      data.notices = notices;
      res.render('admin', data);
    });
  } else {
    res.render('admin', data);
  }
};

Admin.prototype.login_post = function(req, res) {
  if (req.body.password == 'penguins') {
    req.session.loggedIn = true;
  }
  res.redirect('/admin');
};

module.exports = new Admin();