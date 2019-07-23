const socketio = require('socket.io');
const io = socketio();
const socketApi = {};
const superagent = require('superagent');
const mongoose = require('mongoose');

const quiz = require('../models/Quiz');
socketApi.io = io;

// var Quizez = {
//   "11911": {
//     "players": [{socketId:"id", "name": "ali", answers: [{questionId: "", answer: "a/b/c/d", time:"10"}]}],
//     currentQuestion: "x objesi",
//     currentQuestionStartTime: new Date()
//   }
// }

let players = [];

const pinControl = (data, callback) => {
  const promise = quiz.find({ pin: data, active: true });
  
  promise.then((data) => {
    callback(data);
  }).catch((err) => {
    callback(err);
  });

}

io.on('connection', (socket) => {
  console.log('Bağlandı');
  socket.emit('connected');

  socket.on('sendPin', (data) => {
    pinControl(data, (body) => {  
      socket.emit('sendQuiz', body);
    });
  });

  socket.on('sendUsername', (data) => {
      players.push(data);
      socket.emit('newUser', players);
      socket.broadcast.emit('newUser', players);

  });
  
});

module.exports = socketApi; 