let express = require('express');
let moment = require('moment');
let async = require('async');
let mongoose = require('mongoose');
let Schedule = mongoose.model('Schedule')
  , Marquee = mongoose.model('Marquee')
  , Notice = mongoose.model('Notice');

let router = express.Router();

router.get('/', (req, res) => {
  async.parallel({
    'schedule': (callback) => {
      Schedule.getActive(callback);
    },

    'marquees': (callback) => {
      Marquee.getAll(callback);
    },

    'notices': (callback) => {
      Notice.getAll(callback);
    }
  },

  // We've got periods, marquees, and notices. Render.
  function(err, results) {
    res.render('clock', results);
  });

});

module.exports = router;
