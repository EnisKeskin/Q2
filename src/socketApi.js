const socketio = require('socket.io');
const io = socketio();
const socketApi = { };

socketApi.io = io;

io.on('connection', (socket) => {
  socket.on('Enis', (data) => {
      console.log(data);
  })
})

module.exports = socketApi; 