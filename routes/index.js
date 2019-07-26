module.exports = (io) => {

  const app = require('express');
  const router = app.Router();
  const mongoose = require('mongoose');
  const quiz = require('../models/Quiz');

  router.get('/', (req, res, next) => {
    res.render('index');
  });

  router.post('/', (req, res, next) => {
    const p = req.body.pin;
    if (Rooms[p] != null || Rooms[p] != undefined) {
      res.redirect('game?pin=' + p);
    }
    else {
      const promise = quiz.find({ pin: p });

      promise.then((data) => {
        if (data.length != 0) {
          Rooms[p] = {
            players: {},
            started: false,
            questionIndex: 0
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