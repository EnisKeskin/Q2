const express = require('express');
const router = express.Router();

router.get('/', function (req, res, next) {
  res.render('discover', {
    Trending: [
      {
        slickIndex: 0,
        quizImage: "images/sago.jpg",
        quizTitle: "Quiz",
        questionCount: 5,
        ownerName: "Burak",
        ownerImage: "images/sago.jpg"
      },
      {
        slickIndex: 1,
        quizImage: "images/sago.jpg",
        quizTitle: "Quiz",
        questionCount: 5,
        ownerName: "Burak",
        ownerImage: "images/sago.jpg"
      },
      {
        slickIndex: 2,
        quizImage: "images/sago.jpg",
        quizTitle: "Quiz",
        questionCount: 5,
        ownerName: "Burak",
        ownerImage: "images/sago.jpg"
      }
    ],
    Discover: [
      {
        slickIndex: 0,
        quizImage: "images/sago.jpg",
        quizTitle: "Quiz",
        questionCount: 5,
        ownerName: "Burak",
        ownerImage: "images/sago.jpg"
      },
      {
        slickIndex: 1,
        quizImage: "images/sago.jpg",
        quizTitle: "Quiz",
        questionCount: 5,
        ownerName: "Burak",
        ownerImage: "images/sago.jpg"
      },
      {
        slickIndex: 2,
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