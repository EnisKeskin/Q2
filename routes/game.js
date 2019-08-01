module.exports = (io) => {
  const express = require('express');
  const router = express.Router();
  const gameNamespace = io.of("/game");
  const mongoose = require('mongoose');
  const quiz = require('../models/Quiz');
  const Player = require('../models/Player');
  const Answer = require('../models/Answer');
  const STATISTICS_TIMEOUT = 5000;

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

    function nextQ(data) {
      var p = data.pin;
      Rooms[p].questionIndex++;
      Rooms[p].time = Date.now();

      var arr1 = Rooms[p].players;
      var result = [];
      var ol = Object.keys(arr1);
      for (let i = 0; i < ol.length; i++) {
        result.push(
          {
            name: arr1[ol[i]].username,
            point: arr1[ol[i]].calculateTotalPoints()
          });
      }
      result.sort();
      var f = result.splice(0, 1);
      const index = Rooms[p].questionIndex;
      if (index >= Rooms[p].questionCount) {
        for (let i = 0; i < ol.length; i++) {
          gameNamespace.to(arr1[ol[i]].socket.id).emit('render-content',
            {
              first: f[0],
              results: result,
              command: "SBH"
            });
        }
        delete Rooms[p];
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
    }

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
            Rooms[p].answers[data.answer]++;
            Rooms[p].playersAnswered++;
            let arrr = Object.keys(Rooms[p].players);
            if (arrr.length <= Rooms[p].playersAnswered) {
              for (let i = 0; i < arrr.length; i++) {
                Rooms[p].players[arrr[i]].answers[index].setTime(Rooms[p].time - Date.now());
              }
              const sum = Rooms[p].answers[0] + Rooms[p].answers[1] + Rooms[p].answers[2] + Rooms[p].answers[3];
              var perc = [Rooms[p].answers[0] * 100 / sum, Rooms[p].answers[1] * 100 / sum, Rooms[p].answers[2] * 100 / sum, Rooms[p].answers[3] * 100 / sum];
              var c = ["lightgray", "lightgray", "lightgray", "lightgray"];
              c[result[0].question[index].answer] = "green";
              Rooms[p].playersAnswered = 0;
              for (let i = 0; i < ol.length; i++) {
                gameNamespace.to(arr1[ol[i]].socket.id).emit('render-content',
                  {
                    count: Rooms[p].answers,
                    percent: perc,
                    color: c,
                    answer: q.answers,
                    command: "SH"
                  });
              }
              Rooms[p].answers = [0, 0, 0, 0];
              setTimeout(() => { nextQ({ pin: p }); }, STATISTICS_TIMEOUT);
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

      }

    });
    socket.on('disconnect', () => {
      if (socket.nickname)
        if (Rooms[socket.nickname.split("|")[1]])
          delete Rooms[socket.nickname.split("|")[1]][socket.id];
    });
  });
  return router;
}