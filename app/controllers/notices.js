let express = require('express');
let mongoose = require('mongoose');
let Notice = mongoose.model('Notice');

let router = express.Router();

router.get('/', (req, res) => {
  Notice.getAll((err, notices) => {
    res.locals.notices = notices;
    res.render('admin/notices/index');
  });
});

router.param('notice', (req, res, next, id) => {
  Notice.findById(id, (err, notice) => {
    if (err) return next(err);
    req.notice = notice;
    next();
  });
});

router.post('/create', (req, res) => {
  Notice.create({
    'text': req.body.notice.text
  }, redirectToLanding);

  function redirectToLanding(err) {
    if (err) throw err;
    req.flash('success', 'The notice has been created.');
    res.redirect('/admin/notices');
  }
});

router.get('/:notice/delete', (req, res) => {
  req.notice.remove((err) => {
    if (err) throw err;
    req.flash('success', 'The notice has been destroyed.');
    res.redirect('/admin/notices');
  });
});

router.get('/:notice/edit', (req, res) => {
  res.locals.notice = req.notice;
  res.render('admin/notices/edit');
});

router.post('/:notice/edit', (req, res) => {
  req.notice.text = req.body.notice.text;

  req.notice.save((err) => {
    if (err) throw err;
    req.flash('success', 'The notice has been modified.');
    res.redirect('/admin/notices');
  });
});

module.exports = router;
