var express = require('express');
var moment = require('moment');
var async = require('async');
var mongoose = require('mongoose');
var Schedule = mongoose.model('Schedule')
  , Marquee = mongoose.model('Marquee')
  , Notice = mongoose.model('Notice');

var router = express.Router();

router.get('/', function(req, res, next) {
  var self = this;

  async.parallel({

    'periods': function(callback) {
      Schedule.getActive(function(err, schedule) {
        schedule.getPeriods(callback);
      });
    },

    'marquees': function(callback){
      Marquee.getAll(callback);
    },

    'notices': function(callback) {
      Notice.getAll(callback);
    }
  },

  // We've got periods, marquees, and notices. Render.
  function(err, results) {
    res.render('clock', results);
  });

});

module.exports = router;