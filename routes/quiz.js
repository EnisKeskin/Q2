const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Quiz = require('../models/Quiz');
const User = require('../models/User');
var multer = require('multer');

var storageQuiz = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads');
  },
  filename: function (req, file, cb) {
    cb(null, 'QuizImage-' + Date.now());
  }
});
var uploadQuiz = multer({ storage: storageQuiz });

var storageQuestion = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads');
  },
  filename: function (req, file, cb) {
    cb(null, 'QuestionImage-' + Date.now());
  }
});
var uploadQuestion = multer({ storage: storageQuestion });


router.get('/', ensureAuthenticated, (req, res, next) => {
  const data = {
    'visibility': [
      { option: "To only Me" },
      { option: "To me with friends" },
      { option: "To everyone" },
      { option: "To ONLY Elon Musk" }
    ],
    'location': [
      { option: "Turkey" },
      { option: "China" },
      { option: "USA" },
      { option: "UK" },
      { option: "Mars" }
    ],
    'language': [
      { option: "Turkish" },
      { option: "Chinese" },
      { option: "English" },
      { option: "ElonIsh" }
    ]
  };
  if (req.query.message) {
    data['Message'] = decodeURIComponent(req.query.message);
  }
  return res.render('quiz', data);
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

router.post('/', uploadQuiz.single('fileToUpload'), (req, res) => {
  const pin = pinCreate();
  User.findOne({ username: req.user.username }, (err, user) => {
    if (err || !user || user.length == 0) {
      console.error(err);
      req.logOut();
      return res.redirect('/users?LoginError=' + encodeURIComponent('Unauthorized Post Request :\nWe couldn\'t find you in our database!'));
    }
    const { title, description, location, language, visibility } = req.body;

    req.checkBody("title", "Title is required").notEmpty();
    req.checkBody("description", "Description is required").notEmpty();

    var errors = req.validationErrors();
    if (errors && errors.length > 0)
      return res.redirect('/quiz?Message=' + encodeURIComponent(errors[0].msg));

    var quizObj = {
      title: title,
      description: description,
      location: location,
      language: language,
      pin: pin,
      img: req.file ? "uploads\\" + req.file.filename : "noImage.jpg",
      userId: user._id,
      visibleTo: true,
      visibility: visibility,
      question: [],
      active: false,
      date: Date.now()
    };

    const quiz = new Quiz(quizObj);

    quiz.save().then((result) => {
      res.redirect('/quiz/question?quiz=' + result._id);
    }).catch((error) => {
      if (error) {
        console.error(error);
        res.redirect('/quiz?Message=' + encodeURIComponent("Unknown Error occurred!"));
      }
    });
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
}

router.post('/question', uploadQuestion.single("fileToUpload"), (req, res) => {
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
  res.redirect('/users?LoginError=' + encodeURIComponent("You have to Login to see this page"));
}
module.exports = router;