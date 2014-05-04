var express = require('express');
var mongoose = require('mongoose');
var Notice = mongoose.model('Notice');
var adminUtils = require(__dirname + '/adminUtils');

var router = express.Router();

router.get('/', function(req, res, next) {
  var data = adminUtils.getViewData(req);

  Notice.getAll(function(err, notices) {
    data.notices = notices;
    res.render('admin/pages/notices', data);
  });
});

module.exports = router;