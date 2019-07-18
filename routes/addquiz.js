const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Quiz = require('../models/Quiz');

router.get('/', (req, res, next) => {
  res.send('Add a quiz!');
});

router.post('/', (req, res) => {
  const quiz = new Quiz(req.body);
  const promise = quiz.save();

  promise.then((data) => {
    res.json({ status: 1 })
  }).catch((err) => {
    res.json({ err })
  })

})

module.exports = router;