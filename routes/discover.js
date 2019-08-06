const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const quiz = require('../models/Quiz');

router.get('/', function (req, res, next) {

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
        Trending: [
          {
            quizImage: "images/sago.jpg",
            quizTitle: "Quiz",
            questionCount: 5,
            ownerName: "Burak",
            ownerImage: "images/sago.jpg"
          },
          {
            quizImage: "images/sago.jpg",
            quizTitle: "Quiz",
            questionCount: 5,
            ownerName: "Burak",
            ownerImage: "images/sago.jpg"
          },
          {
            quizImage: "images/sago.jpg",
            quizTitle: "Quiz",
            questionCount: 5,
            ownerName: "Burak",
            ownerImage: "images/sago.jpg"
          },
          {
            quizImage: "images/sago.jpg",
            quizTitle: "Quiz",
            questionCount: 5,
            ownerName: "Burak",
            ownerImage: "images/sago.jpg"
          }
        ],
        Discover: [
          {
            quizImage: "images/sago.jpg",
            quizTitle: "Quiz",
            questionCount: 5,
            ownerName: "Burak",
            ownerImage: "images/sago.jpg"
          },
          {
            quizImage: "images/sago.jpg",
            quizTitle: "Quiz",
            questionCount: 5,
            ownerName: "Burak",
            ownerImage: "images/sago.jpg"
          },
          {
            quizImage: "images/sago.jpg",
            quizTitle: "Quiz",
            questionCount: 5,
            ownerName: "Burak",
            ownerImage: "images/sago.jpg"
          },
          {
            quizImage: "images/sago.jpg",
            quizTitle: "Quiz",
            questionCount: 5,
            ownerName: "Burak",
            ownerImage: "images/sago.jpg"
          },
          {
            quizImage: "images/sago.jpg",
            quizTitle: "Quiz",
            questionCount: 5,
            ownerName: "Burak",
            ownerImage: "images/sago.jpg"
          }
        ]
      });
    }
  });
});

module.exports = router;