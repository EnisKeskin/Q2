module.exports = (io) => {
  const express = require('express');
  const router = express.Router();
  const gameNamespace = io.of("/game");
  const mongoose = require('mongoose');
  const quiz = require('../models/Quiz');
  const Player = require('../models/Player');
  const Answer = require('../models/Answer');
  const SECOND = 1000;
  const STATISTICS_TIMEOUT = 4 * SECOND;
  router.get('/', (req, res, next) => {

    const pin = req.query.pin;
    var Room = Rooms[pin];
    if (Room != null || Room != undefined) {
      res.render('game');
    }
    else {
      quiz.find({ pin: pin }).then((data) => {
        if (data.length != 0) {
          Rooms[pin] = {
            players: {},
            started: false,
            questionIndex: 0,
            questionCount: data[0].question.length,
            playersAnswered: 0,
            answers: [0, 0, 0, 0],
            time: 0
          };
          res.render('game');
        } else {
          alert("There is no game with given pin");
          res.redirect("/");
        }
      }).catch((err) => {
        alert('error: ' + err);
        res.redirect("/");
      });
    }
  });


  gameNamespace.on("connect", function (socket) {

    socket.on('enter-lobby', (pin) => {
      var Room = Rooms[pin];
      if (1)
        var thePlayer = new Player('player_' + Math.floor(Math.random() * 10000), socket);
      Room.players[socket.id] = thePlayer;
      quiz.find({ pin: pin }).then((data) => {
        if (data.length != 0) {
          if (Room.started) {
            const index = Room.questionIndex;
            var question = data[0].question[index];

            thePlayer.fillAnswers(data[0].question.length);

            gameNamespace.to(socket.id).emit('render-content',
              {
                source: handleBarsSources["QH"],
                templatedata: {
                  questionImage: question.img,
                  question: question.questionTitle,
                  answer1: question.answers[0],
                  answer2: question.answers[1],
                  answer3: question.answers[2],
                  answer4: question.answers[3]
                }
              });
          }
          else {
            var playersInLobby = [];
            const players = Object.values(Room.players);

            thePlayer.fillAnswers(data[0].question.length);

            players.forEach((player) => {
              playersInLobby.push({ name: player.username });
            });
            players.forEach((player) => {
              gameNamespace.to(player.socket.id).emit('render-content',
                {
                  source: handleBarsSources["GH"],
                  templatedata: {
                    pin: pin,
                    players: playersInLobby,
                    num: playersInLobby.length
                  }
                });
            });
          }
        }
      });
    });

    socket.on('start-the-game', (data) => {
      var pin = data.pin;
      var Room = Rooms[pin];
      Room.time = Date.now();
      Room.started = true;
      const index = Room.questionIndex;

      quiz.find({ pin: pin }).then((result) => {
        if (result.length != 0) {
          var question = result[0].question[index];
          Object.values(Room.players).forEach((player) => {
            gameNamespace.to(player.socket.id).emit('render-content',
              {
                source: handleBarsSources["QH"],
                templatedata: {
                  questionImage: question.img,
                  question: question.questionTitle,
                  answer1: question.answers[0],
                  answer2: question.answers[1],
                  answer3: question.answers[2],
                  answer4: question.answers[3]
                }
              });
          });
          setTimeout(() => { statistics(pin); }, question.time * SECOND);
        }
      });
    });

    function nextQ(pin) {
      var Room = Rooms[pin];
      var players = Object.values(Room.players);
      var index = ++(Room.questionIndex);
      var results = [];

      Room.time = Date.now();

      players.forEach((player) => {
        results.push({ name: player.username, point: player.calculateTotalPoints() });
      });
      results.sort((a, b) => { return b.point - a.point; });
      var firstPlace = results.splice(0, 1)[0];

      if (index >= Room.questionCount) {
        players.forEach((player) => {
          gameNamespace.to(player.socket.id).emit('render-content',
            {
              source: handleBarsSources["SBH"],
              templatedata: {
                first: firstPlace,
                results: results
              }
            });
        });
        delete Rooms[pin];
      }
      else {
        quiz.find({ pin: pin }).then((result) => {
          if (result.length != 0) {
            var question = result[0].question[index];
            players.forEach((player) => {
              gameNamespace.to(player.socket.id).emit('render-content',
                {
                  source: handleBarsSources["QH"],
                  templatedata: {
                    questionImage: question.img,
                    question: question.questionTitle,
                    answer1: question.answers[0],
                    answer2: question.answers[1],
                    answer3: question.answers[2],
                    answer4: question.answers[3]
                  }
                });
            });
            setTimeout(() => { statistics(pin); }, question.time * SECOND);
          }
        });
      }
    }

    function statistics(pin) {
      var Room = Rooms[pin];
      var index = Room.questionIndex;
      let players = Object.values(Room.players);
      var count = Room.playersAnswered;
      quiz.find({ pin: pin }).then((result) => {
        if (result.length != 0) {
          var theQuiz = result[0];
          var question = theQuiz.question[index];
          var percentages = [
            Room.answers[0] * 100 / count,
            Room.answers[1] * 100 / count,
            Room.answers[2] * 100 / count,
            Room.answers[3] * 100 / count
          ];
          var colors = [
            "lightgray",
            "lightgray",
            "lightgray",
            "lightgray"
          ];
          colors[theQuiz.question[index].answer] = "green";
          Room.playersAnswered = 0;
          players.forEach((player) => {
            gameNamespace.to(player.socket.id).emit('render-content',
              {
                source: handleBarsSources["SH"],
                templatedata: {
                  count: Room.answers,
                  percent: percentages,
                  color: colors,
                  answer: question.answers
                }

              });
          });
          Room.answers = [0, 0, 0, 0];
          setTimeout(() => { nextQ(pin); }, STATISTICS_TIMEOUT);
        }
      });
    }

    socket.on('give-answer', (data) => {
      var pin = data.pin;
      var Room = Rooms[pin];
      var index = Room.questionIndex;
      var thePlayer = Room.players[socket.id];
      let players = Object.values(Room.players);

      if ("isNull" in thePlayer.answers[index]) {
        quiz.find({ pin: pin }).then((result) => {
          if (result.length != 0) {
            var theQuiz = result[0];
            var question = theQuiz.question[index];
            var answer = new Answer(Room.time, Date.now(), question.time * SECOND, data.answer, data.answer == question.answer);
            thePlayer.answers[index] = answer;
            Room.answers[data.answer]++;
            Room.playersAnswered++;
          }
        });
      }
    });

    socket.on('disconnect', () => {
      var name = socket.name;
      if (name) {
        var pin = name.split("|")[1];
        if (Rooms[pin])
          delete Rooms[pin][socket.id];
      }
    });
  });
  return router;
}