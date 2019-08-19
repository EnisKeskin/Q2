const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const quiz = require('../models/Quiz');

router.get('/', ensureAuthenticated, (req, res, next) => {

  quiz.find({}).then((data) => {
    var quizzes = [];

    if (data.length > 0) {
      data.forEach((quiz) => {
        quizzes.push({
          quizImage: quiz.img,
          quizTitle: quiz.title,
          questionCount: quiz.question.length,
          ownerName: "Burak",
          ownerImage: "images/sago.jpg"
        })
      });

      res.render('discover',
        {
          Trending: quizzes,
          Discover: quizzes
        })
    } else {
      res.render('discover', {
        Trending: [],
        Discover: []
      });
    }
  });
});

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect('/');
}

module.exports = router;