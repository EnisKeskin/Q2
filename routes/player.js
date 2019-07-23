module.exports = (io) => {
  const express = require('express');
  const router = express.Router();

  router.get('/', function (req, res, next) {

    let rms = Object.keys(io.sockets.sockets);
    let arr = [];
    for (let i = 0; i < rms.length; i++)
      arr.push({ name: io.sockets.sockets[rms[i]].nickname });
    console.log(arr);
    res.render('player', { items: arr });
  });

  return router;
}