module.exports = (io) => {
  const express = require('express');
  const router = express.Router();
  const gameNamespace = io.of("/game");
  const mongoose = require('mongoose');
  const Quiz = require('../models/Quiz');
  const Player = require('../models/Player');
  const Answer = require('../models/Answer');
  const SECOND = 1000;
  const STATISTICS_TIMEOUT = 4 * SECOND;

  router.get('/', (req, res, next) => {

    const pin = req.query.pin;
    var Room = Rooms[pin];
    if (Room != null || Room != undefined) {
      return res.render('game', { value: 0, time: 100 });
    }
    else {
      Quiz.findOne({ pin: pin }, (error, quiz) => {
        if (error) {
          console.error(error);
          return res.redirect('/');
        }
        else if (!quiz) {
          var msg = encodeURIComponent('There is no game with given pin');
          return res.redirect('/?Message=' + msg);
        }
        else {
          Rooms[pin] = {
            players: {},
            quiz: quiz,
            started: false,
            questionIndex: 0,
            questionCount: quiz.question.length,
            playersAnswered: 0,
            answers: [0, 0, 0, 0],
            time: 0
          };
          res.render('game', { value: 0, time: 100 });
        }
      });
    }
  });


  gameNamespace.on("connect", function (socket) {

    socket.on('enter-lobby', (pin) => {
      var Room = Rooms[pin];
      var quiz = Room.quiz;
      var questions = quiz.questions;
      var thePlayer = new Player('player_' + Math.floor(Math.random() * 10000), socket);
      Room.players[socket.id] = thePlayer;
      if (Room.started) {
        const index = Room.questionIndex;
        const question = questions[index];
        thePlayer.fillAnswers(questions.length);

        gameNamespace.to(socket.id).emit('render-content',
          {
            source: handleBarsSources["QH"],
            templatedata: {
              questionImage: question.img,
              question: question.questionTitle,
              answer1: question.answers[0],
              answer2: question.answers[1],
              answer3: question.answers[2],
              answer4: question.answers[3],
              value: 100,
              time: question.time
            }
          });
      }
      else {
        var playersInLobby = [];
        const players = Object.values(Room.players);
        thePlayer.fillAnswers(questions.length);

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
    });

    socket.on('start-the-game', (data) => {
      const pin = data.pin;
      var Room = Rooms[pin];
      Room.time = Date.now();
      Room.started = true;
      const quiz = Room.quiz;
      const index = Room.questionIndex;
      const question = quiz.question[index];

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
              answer4: question.answers[3],
              value: 100,
              time: question.time
            }
          });
      });
      setTimeout(() => { statistics(pin); }, question.time * SECOND);
    });

    function nextQ(pin) {
      var Room = Rooms[pin];
      Room.time = Date.now();
      var players = Object.values(Room.players);
      var quiz = Room.quiz;
      var questions = quiz.question;
      var index = ++(Room.questionIndex);

      if (index >= questions.length) {
        var results = [];
        players.forEach((player) => {
          results.push({ name: player.username, point: player.calculateTotalPoints() });
        });
        results.sort((a, b) => { return b.point - a.point; });
        var firstPlace = results.splice(0, 1)[0];
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
        var question = questions[index];
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
                answer4: question.answers[3],
                value: 100,
                time: question.time
              }
            });
        });
        setTimeout(() => { statistics(pin); }, question.time * SECOND);
      }
    }

    function statistics(pin) {
      var Room = Rooms[pin];
      var index = Room.questionIndex;
      var count = Room.playersAnswered;
      let players = Object.values(Room.players);
      const quiz = Room.quiz;
      const questions = quiz.question;
      const question = questions[index];
      const percentages = [
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
      ]

      colors[question.answer] = "green";
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

    socket.on('give-answer', (data) => {
      const pin = data.pin;
      var Room = Rooms[pin];
      var index = Room.questionIndex;
      const thePlayer = Room.players[socket.id];
      const quiz = Room.quiz;
      const question = quiz.question[index];
      var answer = new Answer(Room.time, Date.now(), question.time * SECOND, data.answer, data.answer == question.answer);

      thePlayer.answers[index] = answer;
      Room.answers[data.answer]++;
      Room.playersAnswered++;
      var colors = [
        "lightgray",
        "lightgray",
        "lightgray",
        "lightgray"
      ];
      colors[data.answer] = "blue";
      gameNamespace.to(socket.id).emit('render-content',
        {
          source: handleBarsSources["AH"],
          templatedata: {
            questionImage: question.img,
            question: question.questionTitle,
            answer1: question.answers[0],
            answer2: question.answers[1],
            answer3: question.answers[2],
            answer4: question.answers[3],
            color1: colors[0],
            color2: colors[1],
            color3: colors[2],
            color4: colors[3]
          }
        });
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