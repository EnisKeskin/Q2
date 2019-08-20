const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Quiz = require('../models/Quiz');

router.get('/', ensureAuthenticated, (req, res, next) => {

  User.findOne({ username: req.user.username }, (err, user) => {
    if (!err) {
      Quiz.find({ "userId": user._id }, (err, data) => {
        var quizzes = [];
        if (err) {
          console.error("Error:::::" + err);
          redirect("/");
        }
        if (data.length > 0) {

          data.forEach((quiz, index) => {
            quizzes.push({
              img: quiz.img,
              title: quiz.title,
              desc: quiz.description,
              pin: quiz.pin,
              index: index,
              count: quiz.question.length
            })
          });
          res.render('home', {
            myQuizzes: quizzes,
            quizCreated: data.length,
            gamePlayed: 0,
            img: user.imgURL,
            firstname: user.firstname,
            lastname: user.lastname,
            username: user.username
          })
        } else {
          res.render('home', {
            myQuizzes: [],
            quizCreated: 0,
            gamePlayed: 0,
            img: user.imgURL,
            firstname: user.firstname,
            lastname: user.lastname,
            username: user.username
          });
        }

      });
    }
    else {
      console.log("ERROR:\n" + err);
      res.redirect("/");
    }
  });
});

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect('/');
}

module.exports = router;