const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const User = require('../models/User');

router.post('/register', (req, res, next) => {
  const Register = new User(req.body);
  const promise = Register.save();

  promise.then((data) => {
    res.json({ status: 1 });
  }).catch((err) => {
    res.json(err);
  });
})

router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

module.exports = router;
