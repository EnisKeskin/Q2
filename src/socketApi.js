const socketio = require('socket.io');
const io = socketio();
const socketApi = {};
const superagent = require('superagent');
const mongoose = require('mongoose');
var pathToRegexp = require('path-to-regexp')

const quiz = require('../models/Quiz');
socketApi.io = io;

let ROOMS = {};

class RoomControl {
    constructor() {
        this.rooms = {};
    }

    addUser(userId, roomName, username) {
        let room = this.getRoom(roomName);

        room.users[userId] = {
            username: username,
            totalPoint: 0,
            answers: [],
        };
    }

    getRoom(roomName) {
        let room = this.rooms[roomName] ? this.rooms[roomName] : {
            quiz: null,
            startTime: null,
            currentQuestion: 0,
            users: {},
        }
        this.rooms[roomName] = room;
        return room;
    }

    setQuiz(roomName, quiz) {
        this.rooms[roomName].quiz = quiz
    }

    addAnswer(roomName, userId, answer, score, ansToQues) {
        this.rooms[roomName].users[userId].answers.push({ answer, score, ansToQues })
        this.calcTotalPoint(roomName, userId, score);
    }

    calcTotalPoint(roomName, userId, score) {
        let user = this.getRoom(roomName).users[userId];
        user.totalPoint = 0;
        user.answers.forEach((answer) => {
            user.totalPoint += answer.score;
        });
    }

    roomShowUser(roomName) {
        console.log(JSON.stringify(this.getRoom(roomName).users));
    }

    roomUserDelete(roomName, userId) {
        delete this.getRoom(roomName).users[userId];
    }

    getUserNames(roomName) {
        let usernames = [];
        Object.keys(this.getRoom(roomName).users).forEach((userId) => {
            usernames.push(this.getRoom(roomName).users[userId].username)
        });
        if (usernames.length > 0)
            return usernames;
        else null
    }

    nextQuestion(roomName, nextQuestion) {
        this.rooms[roomName].currentQuestion = this.rooms[roomName].quiz[0].question[nextQuestion];
        //oyun başladığında sayaçta başlatılıyor.
        this.rooms[roomName].startTime = Date.now();
        return this.rooms[roomName].quiz[0].question[nextQuestion];
    }

    showStatistics() {

    }

}

const roomControl = new RoomControl();
const pinControl = (data, callback) => {
    quiz.find({ pin: data, active: true })
        .then((data) => {
            callback(data);
        }).catch((err) => {
            callback(err);
        });
}

// soru istatistiği tutulacak ve puan gösterilecek
// istatistik ekranı göründükten sonra bittiğinde server nextQuesion emit edilecek sonra ordan yeni soru brotcaste edilecek.
// kullanıcı bilgileri burda tutulacak
// socket_id
// io.to(pin).emit('userCount', usernames.length); // frontend kısmında yazılacak
io.on('connection', (socket) => {
    console.log('Bağlandı');
    socket.emit('connected');

    socket.on('sendPin', (pin) => {

        pinControl(pin, (quiz) => {

            socket.join(pin, () => {
                //roomName alınıyor
                const roomName = Object.keys(socket.rooms)[0];
                //UserId alınıyor
                const userId = Object.keys(socket.rooms)[1];
                //Odayı kontrol edebilmek için roomControl sınıfına atanıyor
                roomControl.getRoom(roomName);
                //odanın içinq quiz atanıyor
                roomControl.setQuiz(roomName, quiz);
                //odaya girdiğine dair bilgi
                io.to(pin).emit('join', { status: true });
                //username girdiğininde bu kontroller çalışacak otomatik.
                socket.on('sendUsername', (username) => {
                    // gelen kullanıcıyı id ve hangi roomName sahip olduğunu ve kullanıcı adı ile kaydediyor.
                    roomControl.addUser(userId, roomName, username);
                    //player ekranında tüm kullanıcılar görünüyor
                    io.to(pin).emit('newUser', roomControl.getUserNames(roomName));
                    //client kısmında başla komutu geldiğinde işleyecek.
                    socket.on('startGame', () => {
                        //ilk soru ekleniyor.
                        io.to(pin).emit('gameStart');
                        //soruyu gönderiyor
                        nextQuestion(showStaticstics);
                    });
                    let question = 0;
                    const nextQuestion = (callback) => {
                        io.to(roomName).emit('newQuestion', roomControl.nextQuestion(roomName, question));
                        setTimeout(() => {
                            callback();
                        }, roomControl.rooms[roomName].currentQuestion.time * 1000);
                        question++;
                    }
                    const showStaticstics = () => {
                            let answernumber = 0;
                            let answStatic = []
                            Object.keys(roomControl.getRoom(roomName).users).forEach((userId) => {
                                answStatic.push(roomControl.getRoom(roomName).users[userId].answers[answernumber]);
                            });
                            console.log(answernumber);
                            answernumber++;
                            io.to(roomName).emit('staticstics', answStatic);
                            setTimeout(() => {
                                if (roomControl.rooms[roomName].quiz[0].question.length !== question) {
                                    nextQuestion(showStaticstics);
                                } else {
                                    console.log("Son soru bitti beybisi");
                                }
                            }, 5000);
                        }
                        // setTimeout(() => {
                        //     console.log(Date.now());
                        //     io.to(roomName).emit('newQuestion', roomControl.nextQuestion(roomName, answernumber));
                        // }, 5000)

                    //soruya cevap verildiğinde ekleniyor
                    socket.on('sendAnswer', (user) => {
                        //soru geri gönderilirken currentQuestion.time işe yarayacak.
                        let questionScore = 0
                        if (user.answer === roomControl.rooms[roomName].currentQuestion.answer) {
                            questionScore = (1000 - ((Date.now() - roomControl.rooms[roomName].startTime) / 10));
                            questionScore = Math.max(100, questionScore);
                        }
                        console.log(`RoomName ${roomName} \n ${userId} \n ${user.answer} \n ${questionScore} \n ${roomControl.rooms[roomName].currentQuestion.answer}`);

                        roomControl.addAnswer(roomName, userId, user.answer, questionScore, roomControl.rooms[roomName].currentQuestion.answer);

                    });

                    socket.on('disconnect', () => {
                        roomControl.roomUserDelete(roomName, userId);
                        io.to(pin).emit('newUser', roomControl.getUserNames(roomName));
                    });
                });
                // soruları tek tke gönder ve herkese socket.io şeklinde gönder.
            });

        });

    });

});


module.exports = socketApi;