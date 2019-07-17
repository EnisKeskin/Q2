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

router.get('/', (req, res, next) => {
  res.render('index', { title: 'Login Page' });
});

module.exports = router;