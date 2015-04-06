let express = require('express');
let mongoose = require('mongoose');
let Marquee = mongoose.model('Marquee');

let router = express.Router();

router.get('/', (req, res) => {
  Marquee.getAll((err, marquees) => {
    res.locals.marquees = marquees;
    res.render('admin/marquee/index');
  });
});

router.param('marquee', (req, res, next, id) => {
  Marquee.findById(id, (err, marquee) => {
    if (err) return next(err);
    req.marquee = marquee;
    next();
  });
});

router.post('/create', (req, res) => {
  Marquee.create({
    'text': req.body.marquee.text
  }, redirectToLanding);

  function redirectToLanding(err) {
    if (err) throw err;
    req.flash('success', 'The marquee has been created.');
    res.redirect('/admin/marquee');
  }
});

router.get('/:marquee/delete', (req, res) => {
  req.marquee.remove((err) => {
    if (err) throw err;
    req.flash('success', 'The marquee has been destroyed.');
    res.redirect('/admin/marquee');
  });
});

router.get('/:marquee/edit', (req, res) => {
  res.locals.marquee = req.marquee;
  res.render('admin/marquee/edit');
});

router.post('/:marquee/edit', (req, res) => {
  req.marquee.text = req.body.marquee.text;

  req.marquee.save((err) => {
    if (err) throw err;
    req.flash('success', 'The marquee has been modified.');
    res.redirect('/admin/marquee');
  });
});

module.exports = router;
