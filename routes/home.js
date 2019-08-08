const express = require('express');
const router = express.Router();

router.get('/', ensureAuthenticated, (req, res, next) => {
  res.render('home');
});

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect('/');
}

module.exports = router;