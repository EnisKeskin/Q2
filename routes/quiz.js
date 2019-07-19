const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Quiz = require('../models/Quiz');

router.get('/', (req, res, next) => {
  res.render('quiz');
});

router.post('/', (req, res) => {
  const quiz = new Quiz(req.body);
  const promise = quiz.save();

  promise.then((data) => {
    res.json({ status: 1 })
  }).catch((err) => {
    res.json({ err });
  })

})

<<<<<<< HEAD
=======
//quiz_id
>>>>>>> e8fe02d51e351a41e23d87dad11f627f09b5dce6
router.post('/question', (req, res) => {
  const question = req.body;
  Quiz.findById(question.quiz_id, (err, data) => {
    if (err)
      throw err;
    
    data.question.push(question);
    data.save();
  });
})


module.exports = router;

// {
//   "title": "Ankara",
//   "description": "Sorularla Ankarayı tanıyalım",
//   "location": "Turkey",
//   "language": "Turkish",
//   "pin": 765221,
//   "img": "img1.jpg",
//   "question": []
//   "active":true  -> oyun şu anda oynanma aşamasında
// }


// question{
//   "questionTitle": "Ankaranın ilkleri",
//   "answers": [
//     "ali",   //answer-1
//     "veli",  //answer-2
//     "49",    //answer-3
//     "50"     //answer-4
//    ],  
//   "answer": "2",
//   "time": 10,
//   "img": "s-img1.jpg",
//   "quiz_id": "5d305364629fa117538a58e8"
// }