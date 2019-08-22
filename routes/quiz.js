const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Quiz = require('../models/Quiz');
const User = require('../models/User');
var multer = require('multer');
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads');
  },
  filename: function (req, file, cb) {
    cb(null, 'QuizImage-' + Date.now());
  }
});
var upload = multer({ storage: storage });


router.get('/', ensureAuthenticated, (req, res, next) => {
  User.findOne({ username: req.user.username }, (err, user) => {
    Quiz.find({ userId: user._id }, (err, quizzes) => {
      console.log("Quiz: " + quizzes);
    });
  });
  res.render('quiz',
    {
      visibility: [
        { option: "Visibility0" },
        { option: "Visibility1" },
        { option: "Visibility2" },
        { option: "Visibility3" }
      ],
      location: [
        { option: "Turkey" },
        { option: "China" },
        { option: "USA" },
        { option: "UK" },
        { option: "Mars" }
      ],
      language: [
        { option: "Turkish" },
        { option: "Chinese" },
        { option: "English" },
        { option: "ElonIsh" }
      ]
    }
  );
});

router.get('/question', ensureAuthenticated, (req, res, next) => {
  const quizID = req.query.quiz;
  User.findOne({ username: req.user.username }, (err, user) => {
    if (err) {
      console.error(err);
      res.redirect("/");
    }
    else if (!quizID || quizID == "") {
      res.redirect("/quiz");
    }
    else {
      Quiz.findOne({ userId: user._id, _id: quizID }, (err, quiz) => {
        if (err) {
          console.error(err);
          res.redirect("/quiz");
        }
        else {
          res.render('question', { quizID: quizID });
        }
      });
    }
  });

});

router.post('/', upload.single('fileToUpload'), (req, res) => {
  const pin = pinCreate();
  User.findOne({ username: req.user.username }, (err, user) => {
    //5d5a9ae7476b4d3348491aa4
    if (err || !user || user.length == 0) {
      console.error(err);
      res.redirect("/");
    }
    else {
      var quizObj = {
        title: req.body.title,
        description: req.body.description,
        location: req.body.location,
        language: req.body.language,
        pin: pin,
        img: req.file ? "uploads\\" + req.file.filename : "noImage.jpg",
        userId: user._id,
        visibleTo: true,
        visibility: req.body.visibility,
        question: [],
        active: false,
        date: Date.now()
      };
      const quiz = new Quiz(quizObj);
      console.log("Quiz: " + quiz);
      quiz.save().then((data) => {
        console.log("data: " + data);
        res.redirect("/quiz/question?quiz=" + data._id);
      }).catch((err) => {
        if (err) {
          console.error(err);
          res.redirect("/quiz");
        }
      });
    }
  }).catch((err) => {
    if (err) {
      console.error(err);
      res.redirect("/quiz");
    }
  });
})

function pinCreate() {
  let randomKey = 0;
  randomKey = Math.floor(Math.random() * 1000000) + 100000;
  Quiz.findOne({ pin: randomKey }).then((data) => {
    if (data) {
      return pinCreate();
    } else {
      return randomKey;
    }
  });
  return randomKey;
}

router.post('/question', upload.single("fileToUpload"), (req, res) => {
  const quizID = req.body.quizID;
  console.log(req.body);
  var question = {
    questionTitle: req.body.title,
    answers: [
      req.body.answer1,
      req.body.answer2,
      req.body.answer3,
      req.body.answer4
    ],
    answer: parseInt(req.body.option, 10),
    time: parseInt(req.body.time, 10) * 10,
    img: req.file ? "uploads\\" + req.file.filename : "noImage.jpg"
  }
  User.findOne({ username: req.user.username }, (err, user) => {
    if (err) {
      console.error(err);
      res.redirect("/");
    }
    else if (!quizID || quizID == "") {
      res.redirect("/quiz");
    }
    else {
      Quiz.findOne({ userId: user._id, _id: quizID }, (err, data) => {
        if (err) {
          console.error(err);
          res.redirect("/quiz/question?quiz=" + quizID);
        }
        else {
          console.log(data);
          data.question.push(question);
          data.save();
          res.redirect("/quiz/question?quiz=" + quizID);
        }
      });
    }
  });
})

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect('/');
}
module.exports = router;