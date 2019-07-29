module.exports = (io) => {
  const express = require('express');
  const router = express.Router();
  const gameNamespace = io.of("/game");
  const mongoose = require('mongoose');
  const quiz = require('../models/Quiz');
  const Player = require('../models/Player');
  const Answer = require('../models/Answer');
  const time;
  router.get('/', (req, res, next) => {
    const p = req.query.pin;
    if (Rooms[p] != null || Rooms[p] != undefined)
      res.render('game');
    else {
      quiz.find({ pin: p }).then((data) => {
        if (data.length != 0) {
          res.render('game');
        } else {
          res.redirect("http://localhost:3000/");
        }
      }).catch((err) => {
        console.log('error: ' + err);
        res.json(err);
      });
    }
  });


  gameNamespace.on("connect", function (socket) {

    socket.on('enter-lobby', (pin) => {
      var player = new Player('player_' + Math.floor(Math.random() * 10000), socket);
      Rooms[pin].players[socket.id] = player;
      if (Rooms[pin].started) {
        quiz.find({ pin: pin }).then((data) => {
          if (data.length != 0) {
            var arr1 = Rooms[pin].players;
            var ol = Object.keys(arr1);
            const index = Rooms[pin].questionIndex;
            for (let i = 0; i < ol.length; i++) {
              var q = data[0].question[index];
              gameNamespace.to(socket.id).emit('render-content',
                {
                  question: q.questionTitle,
                  answer1: q.answers[0],
                  answer2: q.answers[1],
                  answer3: q.answers[2],
                  answer4: q.answers[3],
                  command: "QH"
                });
            }
          }
        });
      }
      else {
        var arr1 = Rooms[pin].players;
        var ol = Object.keys(arr1);
        var arr = [];
        for (let i = 0; i < ol.length; i++) {
          arr.push({ name: arr1[ol[i]].username.split("|")[0] });
        }
        for (let i = 0; i < ol.length; i++) {
          gameNamespace.to(arr1[ol[i]].socket.id).emit('render-content',
            {
              pin: pin,
              players: arr,
              num: arr.length,
              command: "GH"
            });
        }
      }
    });

    socket.on('start-the-game', (data) => {
      time = Date.now();
      var p = data.p;
      var arr1 = Rooms[p].players;
      Rooms[p].started = true;
      const index = Rooms[p].questionIndex;
      var ol = Object.keys(arr1);

      quiz.find({ pin: p }).then((result) => {
        if (result.length != 0) {
          for (let i = 0; i < ol.length; i++) {
            var q = result[0].question[index];
            gameNamespace.to(arr1[ol[i]].socket.id).emit('render-content',
              {
                question: q.questionTitle,
                answer1: q.answers[0],
                answer2: q.answers[1],
                answer3: q.answers[2],
                answer4: q.answers[3],
                command: "QH"
              });
          }
        }
      });
    });

    socket.on('next-question', (data) => {
      time = Date.now();

      var p = data.p;
      var arr1 = Rooms[p].players;
      Rooms[p].questionIndex++;
      if (Rooms[p].questionIndex >= Rooms.questionCount) {
        for (let i = 0; i < ol.length; i++) {
          gameNamespace.to(arr1[ol[i]].socket.id).emit('end-the-game',
            {
            });
        }
      }
      else {
        quiz.find({ pin: p }).then((result) => {
          if (result.length != 0) {
            for (let i = 0; i < ol.length; i++) {
              var q = result[0].question[index];
              gameNamespace.to(arr1[ol[i]].socket.id).emit('render-content',
                {
                  question: q.questionTitle,
                  answer1: q.answers[0],
                  answer2: q.answers[1],
                  answer3: q.answers[2],
                  answer4: q.answers[3],
                  command: "QH"
                });
            }
          }
        });
      }
    });

    socket.on('give-answer', (data) => {
      var p = data.p;
      var arr1 = Rooms[p].players;
      const index = Rooms[p].questionIndex;
      if (arr1[socket.id].answers.length <= index) {
        quiz.find({ pin: p }).then((result) => {
          if (result.length != 0) {
            var q = result[0].question[index];
            const answer = new Answer(time, Date.now(), data.answer, data.answer == q.answer);
            arr1[socket.id].answers.push(answer);
          }
        });
        Rooms[p].playersAnswered++;
        if (Object.keys(Rooms[p].players).length <= Rooms[p].playersAnswered) {
          for (let i = 0; i < ol.length; i++) {
            gameNamespace.to(arr1[ol[i]].socket.id).emit('render-result',
              {
              });
          }
        }
        else {
          gameNamespace.to(socket.id).emit('render-answered',
            {
            });
        }
      }

    });
    socket.on('disconnect', () => {
      if (Rooms[socket.nickname.split("|")[1]])
        delete Rooms[socket.nickname.split("|")[1]][socket.id];
    });
  });
  return router;
}