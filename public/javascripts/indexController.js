const socket = io.connect('http://localhost:3000/');

socket.on('quiz', (data) => {
    console.log(data);
});
