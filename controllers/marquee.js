var express = require('express');
var mongoose = require('mongoose');
var Marquee = mongoose.model('Marquee');
var adminUtils = require(__dirname + '/adminUtils');

var router = express.Router();

router.get('/', function(req, res, next) {
  var data = adminUtils.getViewData(req);

  Marquee.getAll(function(err, marquees) {
    data.marquees = marquees;
    res.render('admin/pages/marquee', data);
  });
});

module.exports = router;