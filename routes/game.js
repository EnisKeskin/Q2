module.exports = (io) => {
  const express = require('express');
  const router = express.Router();
  const gameNamespace = io.of("/game");

  router.get('/', (req, res, next) => {
    res.render('game');
  });


  gameNamespace.on("connect", function (socket) {
    var name = 'player_' + Math.floor(Math.random() * 10000);
    socket.nickname = name;
    socket.on('enter-lobby', (pin) => {
      socket.nickname = socket.nickname + "|" + pin;
      Rooms[pin].clients[socket.id] = socket;

      var arr1 = Rooms[pin].clients;
      var ol = Object.keys(arr1);
      var arr = [];
      for (let i = 0; i < ol.length; i++) {
        arr.push({ name: arr1[ol[i]].nickname.split("|")[0] });
      }
      for (let i = 0; i < ol.length; i++) {
        gameNamespace.to(arr1[ol[i]].id).emit('render-content',
          {
            pin: pin,
            players: arr,
            num: arr.length,
            command: "GH"
          });
      }
    });
    socket.on('start-the-game', (data) => {
      var arr1 = Rooms[data.p].clients;
      var ol = Object.keys(arr1);
      for (let i = 0; i < ol.length; i++) {
        gameNamespace.to(arr1[ol[i]].id).emit('render-content',
          {
            question: "RENK",
            answer1: "Beyaz",
            answer2: "Beyaz",
            answer3: "Siyah",
            answer4: "Beyaz",
            command: "QH"
          });
      }
    });
    socket.on('disconnect', () => {
      delete Rooms[socket.nickname.split("|")[1]][socket.id];
    });
  });
  return router;
}