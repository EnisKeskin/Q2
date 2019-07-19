const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');


const quiz = require('../models/Quiz');

router.get('/', (req, res, next) => {
  res.send('Quiz in detail!');
});

//pin  -> JSON verisiyle gelecek
router.post('/quiz', (req, res) => {
  const promise = quiz.find({pin: req.body.pin});

  promise.then((data) => {
    res.json(data);
  }).catch((err) => {
    res.json(err);
  });

});

module.exports = router;