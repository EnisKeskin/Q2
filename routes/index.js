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
    const promise = quiz.find({ pin: req.body.pin, active: true });

    promise.then((data) => {
      if (data.length != 0) {
        res.redirect(200, 'game?pin=' + req.body.pin);
      } else {
        res.redirect(200, 'game?pin=' + req.body.pin);
        //res.render('index', { status: 0, message: "There is no active game with provided code" });
      }
    }).catch((err) => {
      console.log('error: ' + err);
      res.json(err);
    });

  });

  return router;
}