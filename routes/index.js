module.exports = (io) => {

  const mongoose = require('mongoose');
  const app = require('express');
  const router = app.Router();
  const quiz = require('../models/Quiz');

  router.get('/', (req, res, next) => {
    res.render('index');
  });

  // aktif oyun varsa ona yönlendirecek
  router.post('/', (req, res, next) => {
    const p = req.body.pin;
    if (Rooms[p]) {
      res.redirect('gane?pin=' + p);
    }
    else {
      const promise = quiz.find({ pin: p });

      promise.then((data) => {
        if (data.length != 0) {
          Rooms[p] = {
            clients:{},
            started:false,
            questionIndex=0,
            answers:{}
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