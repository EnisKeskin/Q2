const socketio = require('socket.io');
const io = socketio();
const socketApi = {};
const superagent = require('superagent');
const mongoose = require('mongoose');
var pathToRegexp = require('path-to-regexp')

const quiz = require('../models/Quiz');
socketApi.io = io;

let ROOMS = {};
// yeni class yapılacak question room için
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
            currentQuestion: null,
            currentQuestionIndex: -1,
            users: {},
        }
        this.rooms[roomName] = room;
        return room;
    }

    setQuiz(roomName, quiz) {
        this.rooms[roomName].quiz = quiz
    }

    addAnswer(roomName, userId, answer, score, ansToQues) {
        const room = this.getRoom(roomName);
        room.users[userId].answers.push({ answer, score, ansToQues })
        this.calcTotalPoint(roomName, userId, score);
    }

    calcTotalPoint(roomName, userId, score) {
        let user = this.getRoom(roomName).users[userId];
        user.totalPoint = 0;
        user.answers.forEach((answer) => {
            user.totalPoint += answer.score;
        });
    }

    top5(roomName) {
        let score = [];
        let room = this.getRoom(roomName)
        Object.keys(room.users).forEach((userId) => {
            score.push({
                username: room.users[userId].username,
                score: room.users[userId].totalPoint,
            });
        });
        score.sort((a, b) => {
            if (a.score === b.score) {
                return 0;
            }
            return a.score < b.score ? 1 : -1;
        })
        return score;
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

    nextQuestion(roomName) {
        const room = this.getRoom(roomName);
        room.currentQuestionIndex += 1;
        console.log(room.currentQuestionIndex);
        if (room.currentQuestionIndex > room.quiz[0].question.length) {
            return null;
        }
        room.currentQuestion = room.quiz[0].question[room.currentQuestionIndex];
        //oyun başladığında sayaçta başlatılıyor.
        room.startTime = Date.now();
        return room.currentQuestion;
    }

    resetRoom(roomName) {
        const room = this.getRoom(roomName);
        room.currentQuestion = null;
        room.currentQuestionIndex = -1;
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
                const room = roomControl.getRoom(roomName);
                //odanın içinq quiz atanıyor
                roomControl.setQuiz(roomName, quiz);
                //odaya girdiğine dair bilgi
                socket.emit('join', { status: true });
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
                        roomControl.resetRoom(roomName);
                        //soruyu gönderiyor
                        // room resetlenecek bir fonksiyonlanacak
                        room.currentQuestion = null;
                        nextQuestion();
                    });

                    let answernumber = 0;

                    const nextQuestion = () => {

                        const question = roomControl.nextQuestion(roomName);
                        console.log(question)
                        if (!question) {
                            io.to(roomName).emit('showScoreboard');
                            io.to(roomName).emit('Scoreboard', roomControl.top5(roomName));

                            return;
                        }
                        io.to(roomName).emit('newQuestion', question);

                        setTimeout(() => {
                            let answStatic = []
                            Object.keys(room.users).forEach((userId) => {
                                answStatic.push(room.users[userId].answers[answernumber]);
                            });
                            answernumber++;
                            io.to(roomName).emit('staticstics', answStatic);

                            setTimeout(() => {
                                if (room.quiz[0].question.length !== question) {
                                    nextQuestion();
                                }
                            }, 5000);

                        }, room.currentQuestion.time * 1000);
                    }
                    //result
                    //soruya cevap verildiğinde ekleniyor
                    socket.on('sendAnswer', (user) => {
                        //soru geri gönderilirken currentQuestion.time işe yarayacak.
                        let questionScore = 0
                        if (user.answer === roomControl.rooms[roomName].currentQuestion.answer) {
                            questionScore = (1000 - ((Date.now() - roomControl.rooms[roomName].startTime) / 10));
                            questionScore = Math.max(100, questionScore);
                        }
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