const socketio = require('socket.io');
const io = socketio();
const socketApi = {};
const mongoose = require('mongoose');
var hbs = require('express-handlebars').create({
  partialsDir: [
    'views/partials/'
  ]
});

const quiz = require('../models/Quiz');

socketApi.io = io;

// var Quizez = {
//   "11911": {
//     "players": [{socketId:"id", "name": "ali", answers: [{questionId: "", answer: "a/b/c/d", time:"10"}]}],
//     currentQuestion: "x objesi",
//     currentQuestionStartTime: new Date()
//   }
// }

io.on('connection', (socket) => {
  console.log('Bağlandı');
  socket.emit('connected');

  socket.on('pinSend', (data) => {
    quiz.findOne({ pin: data.pin, active: true }).then((entry) => {
      if(entry) {
        // Quizez[data.pin].players.push(["socket"])
        hbs.render('views/partials/home.handlebars', {entry: entry}).then((data) => {
          socket.emit("quiz_start", data);
        })
      }
    }).catch((err) => {
     console.log(err);
    });
  });



});

module.exports = socketApi; 