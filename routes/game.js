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
    const pin = req.query.pin;
    var Room = Rooms[pin];
    if (Room != null || Room != undefined)
      res.render('game');
    else {
      quiz.find({ pin: pin }).then((data) => {
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
      var Room = Rooms[pin];
      Room.players[socket.id] = player;
      if (Room.started) {
        quiz.find({ pin: pin }).then((data) => {
          if (data.length != 0) {
            const index = Room.questionIndex;
            var question = data[0].question[index];

            gameNamespace.to(socket.id).emit('render-content',
              {
                question: question.questionTitle,
                answer1: question.answers[0],
                answer2: question.answers[1],
                answer3: question.answers[2],
                answer4: question.answers[3],
                command: "QH"
              });
          }
        });
      }
      else {
        var playersInLobby = [];
        const playerkeys = Object.keys(Room.players);

        playerkeys.forEach((p) => {
          playersInLobby.push({ name: p.username.split("|")[0] });
        });
        playerkeys.forEach((p) => {
          gameNamespace.to(p.socket.id).emit('render-content',
            {
              pin: pin,
              players: playersInLobby,
              num: playersInLobby.length,
              command: "GH"
            });
        });
      }
    });

    socket.on('start-the-game', (data) => {
      var pin = data.p;
      var Room = Rooms[pin];
      Room.time = Date.now();
      Room.started = true;
      const index = Room.questionIndex;

      quiz.find({ pin: pin }).then((result) => {
        if (result.length != 0) {
          var question = result[0].question[index];
          Object.keys(Room.players).forEach((player) => {
            gameNamespace.to(player.socket.id).emit('render-content',
              {
                question: question.questionTitle,
                answer1: question.answers[0],
                answer2: question.answers[1],
                answer3: question.answers[2],
                answer4: question.answers[3],
                command: "QH"
              });
          });
        }
      });
    });

    function nextQ(pin) {
      var Room = Rooms[pin];
      var playerKeys = Object.keys(Room.players);
      var index = Room.questionIndex;
      var results = [];

      Room.questionIndex++;
      Room.time = Date.now();

      playerKeys.forEach((player) => {
        results.push({ name: player.username, point: player.calculateTotalPoints() });
      });
      results.sort((a, b) => { return b.point - a.point; });
      var firstPlace = results.splice(0, 1)[0];

      if (index >= Room.questionCount) {
        playerKeys.forEach((player) => {
          gameNamespace.to(player.socket.id).emit('render-content',
            {
              first: firstPlace,
              results: results,
              command: "SBH"
            });
        });
        delete Rooms[pin];
      }
      else {
        quiz.find({ pin: pin }).then((result) => {
          if (result.length != 0) {
            var question = result[0].question[index];
            playerKeys.forEach((player) => {
              gameNamespace.to(player.socket.id).emit('render-content',
                {
                  question: question.questionTitle,
                  answer1: question.answers[0],
                  answer2: question.answers[1],
                  answer3: question.answers[2],
                  answer4: question.answers[3],
                  command: "QH"
                });
            });
          }
        });
      }
    }

    socket.on('give-answer', (data) => {
      var pin = data.pin;
      var Room = Rooms[pin];
      var index = Room.questionIndex;
      var thePlayer = Room[socket.id];
      let playerKeys = Object.keys(Room.players);

      if (thePlayer.answers.length <= index) {
        quiz.find({ pin: pin }).then((result) => {
          if (result.length != 0) {
            var quiz = result[0];
            var question = quiz.question[index];
            const answer = new Answer(Room.time, Date.now(), data.answer, data.answer == q.answer);
            thePlayer.answers.push(answer);
            Room.answers[data.answer]++;
            Room.playersAnswered++;

            if (playerKeys.length <= Room.playersAnswered) {
              playerKeys.forEach((player) => {
                player.answers[index].setTime(Room.time - Date.now());
              });
              var count = Room.playersAnswered;
              var percentages = [
                Rooms[p].answers[0] * 100 / count,
                Rooms[p].answers[1] * 100 / count,
                Rooms[p].answers[2] * 100 / count,
                Rooms[p].answers[3] * 100 / count
              ];
              var colors = [
                "lightgray",
                "lightgray",
                "lightgray",
                "lightgray"
              ];
              colors[quiz.question[index].answer] = "green";
              Room.playersAnswered = 0;
              playerKeys.forEach((player) => {
                gameNamespace.to(player.socket.id).emit('render-content',
                  {
                    count: Room.answers,
                    percent: percentages,
                    color: colors,
                    answer: question.answers,
                    command: "SH"
                  });
              });
              Room.answers = [0, 0, 0, 0];
              setTimeout(() => { nextQ(p); }, STATISTICS_TIMEOUT);
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