exports.getViewData = function(req) {
  return {
    //loggedIn: req.session.loggedIn,
    loggedIn: true,
    version: '0.2.0'
  };
};