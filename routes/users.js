const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const User = require('../models/User');

router.post('/register', (req, res, next) => {
  const { email, password, firstname, lastname, username } = req.body;
  bcrypt.hash(password, 10).then((hash) => {
    const user = new User({
      email,
      firstname,
      lastname,
      username,
      password: hash
    });

    user.save().then((data) => {
      res.json({ status: 1 });
    }).catch((err) => {
      res.json(err);
    });

  })
});

router.post('/login', (req, res) => {
  const { username, password } = req.body;

  User.findOne({
    username
  }, (err, user) => {
    if (err)
      throw err
    if (!user) {
      res.json({
        status: false,
        message: 'Authenticaton failed, user not found.'
      });
    } else {
      bcrypt.compare(password, user.password).then((result) => {
        if (!result) {
          res.render('users', {
            status: 0,
            message: "Login error",
          });
        } else {
          res.redirect('/home');
        }
      });
    };
  });
});

router.get('/', function (req, res, next) {
  res.render('users');
});

module.exports = router;
