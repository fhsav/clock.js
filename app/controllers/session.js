function Session() {
  this.appVersion = '0.2.0';
};

Session.prototype.getViewData = function(req) {
  return {
    //loggedIn: req.session.loggedIn,
    loggedIn: true,
    version: this.appVersion
  };
};

module.exports = new Session();