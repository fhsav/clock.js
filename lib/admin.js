function Admin() {}

Admin.prototype.setVersion = function(version) {
  this.version = version;
};

Admin.prototype.getViewData = function(req) {
  var viewData = {
    //loggedIn: req.session.loggedIn,
    loggedIn: true,
    version: this.version
  };
  return viewData;
};

module.exports = new Admin();
