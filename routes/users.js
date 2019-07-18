const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

//Models
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
    const promise = user.save();

    promise.then((data) => {
      res.json({ status: 1 });
    }).catch((err) => {
      res.json(err);
    });
  })
});


router.post('/login', (req, res) => {
  const { email, password } = req.body;

  User.findOne({
    email
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
          //Event if password is correct
          res.render('user', {
            status: 0,
            message: "Login error",
          });
        } else {
          res.redirect('/users');
        }
      });
    };
  });
});

router.get('/', (req, res, next) => {
  res.send('respond with a resource');
});

module.exports = router;
