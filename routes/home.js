const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Quiz = require('../models/Quiz');

router.post('/delete', ensureAuthenticated, (req, res) => {
  User.findOne({ username: req.user.username }, (err, user) => {
    if(err){
      console.error(err);
    }
    else{
      Quiz.deleteOne({userId: user._id, _id:req.body.id},(err)=>{
        console.log(err);
      });
    }
  });
  res.redirect("/home");
});

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
              id: "" + quiz._id,
              title: quiz.title,
              desc: quiz.description,
              pin: quiz.pin,
              index: index,
              imgURL: user.imgURL,
              count: quiz.question.length,
              username: user.username
            })
          });
          res.render('home', {
            myQuizzes: quizzes,
            quizCreated: data.length,
            gamePlayed: 0,
            imgURL: user.imgURL,
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