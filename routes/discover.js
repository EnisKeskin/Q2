const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = require('../models/User');
const Quiz = require('../models/Quiz');

router.get('/', ensureAuthenticated, (req, res, next) => {
  var quizData = [];
  var userData = {};
  var quizzes = [];
  Quiz.find({}, (error, qresult) => {
    if (error) {
      console.error(error);
      return res.redirect('/home');
    }
    else if (qresult.length > 0) {
      quizData = qresult;
    }
  }).then(() => {
    User.find({}, (error, result) => {
      if (error) {
        console.error(error);
        return res.redirect('/home');
      }
      else if (result.length > 0) {
        result.forEach((user) => {
          userData[user._id] = user;
        });
      }
    }).then(() => {
      quizData.forEach((quiz) => {
        if (userData[quiz.userId])
          quizzes.push({
            quizImage: quiz.img,
            quizTitle: ((quiz.title.length > 15) ? quiz.title.substring(0, 15) + "..." : quiz.title),
            questionCount: quiz.question.length,
            ownerName: userData[quiz.userId].username,
            ownerImage: userData[quiz.userId].imgURL
          });
      });
      res.render('discover', { Trending: quizzes, Discover: quizzes });
    });
  });
});

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect('/');
}

module.exports = router;