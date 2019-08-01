module.exports = (io) => {

  const app = require('express');
  const router = app.Router();
  const mongoose = require('mongoose');
  const quiz = require('../models/Quiz');

  router.get('/', (req, res, next) => {
    res.render('index');
  });

  router.post('/', (req, res, next) => {
    const pin = req.body.pin;
    var Room = Rooms[pin];
    if (Room != null || Room != undefined) {
      res.redirect('game?pin=' + p);
    }
    else {
      quiz.find({ pin: pin }).then((data) => {
        if (data.length != 0) {
          Room = {
            players: {},
            started: false,
            questionIndex: 0,
            questionCount:data[0].question.length,
            playersAnswered: 0,
            answers: [0,0,0,0],
            time: 0
          };
          res.redirect('game?pin=' + p);
        } else {
          alert("There is no game with given pin");
        }
      }).catch((err) => {
        console.log('error: ' + err);
        res.json(err);
      });
    }

  });

  return router;
}