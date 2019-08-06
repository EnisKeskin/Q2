const express = require('express');
const router = express.Router();

router.get('/', function (req, res, next) {
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
});

module.exports = router;