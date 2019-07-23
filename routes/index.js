module.exports = function (io) {
  const mongoose = require('mongoose');
  const app = require('express');
  const router = app.Router();
  const quiz = require('../models/Quiz');

  router.get('/', (req, res, next) => {
    res.render('index');
  });

  io.on("connect", function (socket) {
    console.log("A user connected");

    socket.on('getname', () => {
      var name ='player_' + Math.floor(Math.random() * 10000);
      io.nickname = name;
      socket.nickname = name;
      console.log(io.nickname + ' just connected!');

      socket.join('room 237', () => {
        let rms = Object.keys(io.sockets.sockets);
        console.log(rms);
      });
      socket.emit('recieve-name',name);
    });
  });

  // aktif oyun varsa ona yönlendirecek
  router.post('/', (req, res, next) => {
    const promise = quiz.find({ pin: req.body.pin, active: true });

    promise.then((data) => {
      if (data.length != 0) {
        res.redirect(200, 'player?pin=' + req.body.pin + '&name=' + io.nickname);
      } else {
        res.redirect(200, 'player?pin=' + req.body.pin + '&name=' + io.nickname);
        //res.render('index', { status: 0, message: "There is no active game with provided code" });
      }
    }).catch((err) => {
      console.log('error: ' + err);
      res.json(err);
    });

  });

  return router;
}