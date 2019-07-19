const socket = io.connect('http://localhost:3000/');



socket.on('connected', (data) => {
    console.log(data);
    
});
