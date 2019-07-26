const socketio = require('socket.io');
const io = socketio();
const socketApi = {};
const superagent = require('superagent');
const mongoose = require('mongoose');
var pathToRegexp = require('path-to-regexp')

const quiz = require('../models/Quiz');
socketApi.io = io;

class userControl {
    constructor() {
        this.connect_id
        this.room_name
        this.username
        this.users = [];
    }

    roomUserAdd(connect_id, room_name, username) {
        this.users.push({
            connect_id: connect_id,
            room_name: room_name,
            username: username
        })
    }

    roomShowUser() {
        console.log(this.users);
    }

    roomUserDelete(connect_id) {
        this.users.forEach((data, key, object) => {
            if (data.connect_id == connect_id) {
                object.splice(key, 1);
            }
        });
    }
}

const a = new userControl();
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

    socket.on('sendPin', (pin) => {

        pinControl(pin, (quiz) => {

            socket.join(pin, () => {
                // soru istatistiği tutulacak ve puan gösterilecek 
                // istatistik ekranı göründükten sonra bittiğinde server nextQuesion emit edilecek sonra ordan yeni soru brotcaste edilecek.
                let startTime;
                let currentQuestion = questions[0];

                io.to(pin).emit('join', { status: true });

                socket.on('sendUsername', (user) => {
                    const room_name = Object.keys(socket.rooms)[0];
                    const connect_id = Object.keys(socket.rooms)[1];
                    console.log(socket.id)
                    a.roomUserAdd(connect_id, room_name, user);

                    const users = [];
                    // kullanıcı bilgileri burda tutulacak
                    // socket_id
                    a.users.forEach((data) => {
                        if (data.room_name == room_name) {
                            users.push(data.username);
                        }
                    });

                    io.to(pin).emit('newUser', users);
                    io.to(pin).emit('userCount', users.length);
                    io.on
                    socket.on('disconnect', () => {
                        a.roomUserDelete(socket.id);
                        const users = [];
                        a.users.forEach((roomData) => {
                            if (roomData.room_name == pin) {
                                users.push(roomData.username);
                            }
                        });
                        io.to(pin).emit('newUser', users);
                        io.to(pin).emit('userCount', users.length);
                    });
                });
                // soruları tek tke gönder ve herkese socket.io şeklinde gönder.
                socket.on('startGame', () => {
                    io.to(pin).emit('gameStarted', currentQuestion);
                    setTimeout(() => {

                    }, currentQuestion.time * 1000);
                    startTime = new Date();
                    console.log(socket.id);
                })

                socket.on('getQuiz', () => {
                    socket.emit('sendQuiz', quiz);
                });

            });

        });

    });

});


module.exports = socketApi;