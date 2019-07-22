const socket = io.connect('http://localhost:3000/');


const pinEntry = document.querySelector('#pin-entry');
const bodyTemp = document.querySelector('body');
socket.on('connected', (data) => {
    pinEntry.addEventListener('click', () => {
        const pin = document.querySelector('#index-pin').value;
        socket.emit('pinSend', { pin: pin });
        socket.on('quiz_start', (html) => {
            
        })
    });
});

// const quiz = new Quiz(req.body);
// const promise = quiz.save();

