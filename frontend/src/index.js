import React from 'react';
import ReactDOM from 'react-dom';
import './stylesheets/style.css';
// import io from './connection';
import App from './App'


ReactDOM.render(<App />, document.getElementById('root'));

// const pinEntry = document.querySelector('#pin')
// socket.on('connected', (data) => {
//     pinEntry.addEventListener('click', () => {
//         const pin = document.querySelector('#index-pin').value;
//         socket.emit('pinSend', { pin: pin });
//         socket.on('quiz_start', (html) => {
            
//         });
//     });
// });



