module.exports = (io) => {
  const express = require('express');
  const router = express.Router();
  const gameNamespace = io.of("/game");
  const mongoose = require('mongoose');
  const quiz = require('../models/Quiz');
  const Player = require('../models/Player');
  const Answer = require('../models/Answer');

  router.post('/', (req, res, next) => {
    //find which button click then emit 'give-answer'
    console.log(req.body);
  });

  router.get('/', (req, res, next) => {
    const p = req.query.pin;
    console.log(Rooms[p]);
    if (Rooms[p] != null || Rooms[p] != undefined)
      res.render('game');
    else {
      quiz.find({ pin: p }).then((data) => {
        if (data.length != 0) {
          res.render('game');
        } else {
          console.log(data, + "\n????")
          res.redirect("http://localhost:3000/");
        }
      }).catch((err) => {
        console.log('error: ' + err);
        res.json(err);
      });
    }
  });


  gameNamespace.on("connect", function (socket) {
    console.log(socket.id + " - connected");
    socket.on('enter-lobby', (pin) => {
      console.log(socket.id + " - entered to the lobby");
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
      var p = data.p;
      Rooms[p].time = Date.now();
      var arr1 = Rooms[p].players;
      Rooms[p].started = true;
      const index = Rooms[p].questionIndex;
      var ol = Object.keys(arr1);

      quiz.find({ pin: p }).then((result) => {
        if (result.length != 0) {
          for (let i = 0; i < ol.length; i++) {
            var q = result[0].question[index];
            console.log(q);
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
      var p = data.pin;
      Rooms[p].time = Date.now();

      var arr1 = Rooms[p].players;
      var result = [];
      var ol = Object.keys(arr1);
      const index = Rooms[p].questionIndex;
      for (let i = 0; i < ol.length; i++) {
        result.push(
          {
            name: arr1[ol[i]].username,
            point: arr1[ol[i]].calculateTotalPoints()
          });
      }
      result.sort();
      Rooms[p].questionIndex++;
      if (Rooms[p].questionIndex >= Rooms.questionCount) {
        for (let i = 0; i < ol.length; i++) {
          gameNamespace.to(arr1[ol[i]].socket.id).emit('end-the-game',
            {
              first: result.splice(0, 1)[0],
              results: result
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
      var p = data.pin;
      var arr1 = Rooms[p].players;
      var ol = Object.keys(arr1);
      const index = Rooms[p].questionIndex;
      if (arr1[socket.id].answers.length <= index) {
        quiz.find({ pin: p }).then((result) => {
          if (result.length != 0) {
            var q = result[0].question[index];
            const answer = new Answer(Rooms[p].time, Date.now(), data.answer, data.answer == q.answer);
            arr1[socket.id].answers.push(answer);
          }
        });
        Rooms[p].playersAnswered++;
        if (Object.keys(Rooms[p].players).length <= Rooms[p].playersAnswered) {
          for (let i = 0; i < ol.length; i++) {
            gameNamespace.to(arr1[ol[i]].socket.id).emit('render-content',
              {
                count: [5, 15, 10, 10],
                percent: [12.5, 37.5, 25, 25],
                color: ["lightgray", "green", "lightgray", "lightgray"],
                answer: ["1", "2", "3", "4"],
                command: "SH"
              });
          }
          setTimeout(() => {
            for (let i = 0; i < ol.length; i++) {
              gameNamespace.to(arr1[ol[i]].socket.id).emit('next-question', { pin: p });
            }
          }, 3000);
        }
        else {
          gameNamespace.to(socket.id).emit('render-content',
            {
              color: ["white", "red", "white", "white"],
              command: "AH"
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