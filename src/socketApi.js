const socketio = require('socket.io');
const io = socketio();
const socketApi = { };

socketApi.io = io;

io.on('connection', (socket) => {
  console.log('Bağlandı');
  socket.emit('connected',{foo: "aaaa"});
})

module.exports = socketApi; 