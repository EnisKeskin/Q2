const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const User = require('../models/User');

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

router.post('/register', (req, res, next) => {
  const { email, password1, firstname, lastname, username } = req.body;

  req.checkBody("firstname", "First name is required").notEmpty();
  req.checkBody("lastname", "Last name is required").notEmpty();
  req.checkBody("username", "Username is required").notEmpty();
  req.checkBody("email", "E-mail is required").notEmpty();
  req.checkBody("email", "E-mail is not valid").isEmail();
  req.checkBody("password1", "Password is required").notEmpty();
  req.checkBody("password2", "Passwords do not match").equals(req.body.password1);

  var errors = req.validationErrors();

  if (errors) {
    res.render('users', {
      errors: errors
    })
  } else {
    bcrypt.hash(password1, 10).then((hash) => {
      const user = new User({
        email: email,
        firstname: firstname,
        lastname: lastname,
        username: username,
        password: hash
      });

      user.save().then((data) => {
        res.location('/home');
        res.redirect('/home');
      }).catch((err) => {
        res.json(err);
      });

    })
  }
});

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.getUserById(id, (err, user) => {
    done(err, user);
  });
});

passport.use(new LocalStrategy((username, password, done) => {
  User.getUserByUsername(username, (err, user) => {
    if (err) {
      throw err;
    }
    if (!user) {
      return done(null, false, { message: "Unknown user" });
    }

    User.comparePassword(password, user.password, (err, isMatch) => {
      if (err) return done(err);
      if (isMatch) return done(null, user);
      else return done(null, false, "Invalid Password");
    });
  });
}));

router.post('/login', passport.authenticate('local', { failureRedirect: "/users", failureFlash: "Invalid username or passwprd" }), (req, res) => {
  res.redirect("/home");
});

router.get('/', ensureNotAuthenticated,function (req, res, next) {
  res.render('users');
});

function ensureNotAuthenticated(req, res, next) {
  if (!req.isAuthenticated()) return next();
  res.redirect('/home');
}

router.get('/register', function (req, res, next) {
  res.send('users');
});

router.get('/logout', (req, res) => {
  req.logout();
  res.location('/');
  res.redirect('/');
});

module.exports = router;
