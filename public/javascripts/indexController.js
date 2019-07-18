const socket = io.connect('http://localhost:3000/');

socket.emit('Enis', {for : "Deneme"});
