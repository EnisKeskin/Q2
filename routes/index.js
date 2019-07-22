const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const quiz = require('../models/Quiz');

router.get('/', (req, res, next) => {
  res.render('index');
});

// aktif oyun varsa ona yönlendirecek
router.post('/', (req, res, next) => {
  const promise = quiz.find({ pin: req.body.pin, active: true });

  promise.then((data) => {
    if (data.length != 0) {
      res.redirect(200,'playerpool?pin='+req.body.pin);
    } else {
      res.redirect(200,'playerpool?pin='+req.body.pin);
      //res.render('index', { status: 0, message: "There is no active game with provided code" });
    }
  }).catch((err) => {
    res.json(err);
  });

});

module.exports = router;