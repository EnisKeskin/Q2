const socketio = require('socket.io');
const socketApi = {};
const superagent = require('superagent');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Quiz = require('../models/Quiz');
const jwt = require('jsonwebtoken');
const key = require('../config').api_top_secret_key;
const Io = socketio();
socketApi.io = Io;

let ROOMS = {};
// yeni class yapılacak question room için
class RoomControl {
    constructor() {
        this.rooms = {};
    }

    addUser(userId, roomName, username) {
        const room = this.getRoom(roomName);

        room.users[userId] = {
            username: username,
            totalPoint: 0,
            answers: [],
        };
    }

    getRoom(roomName) {
        console.log("room oluştu");
        let room = this.rooms[roomName] ? 
        this.rooms[roomName] : {
            quiz: null,
            startTime: null,
            currentQuestion: null,
            currentQuestionIndex: -1,
            users: {},
        }
        console.log(roomName);
        console.log(this.rooms[roomName]);
        // console.log(room);
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

    calcTotalPoint(roomName, userId) {
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
        if (room.currentQuestionIndex > room.quiz.question.length) {
            return null;
        }
        room.currentQuestion = room.quiz.question[room.currentQuestionIndex];
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

class UserControl {
    constructor() {
        this.user = {};
    }
}

const pinControl = (data, callback) => {
    Quiz.find({ pin: data, active: true })
        .then((data) => {
            callback(data);
        }).catch((err) => {
            callback(err);
        });
}

const pinActive = (data, callback) => {
    Quiz.findOneAndUpdate({ pin: data }, { active: true }).then((quiz) => {
        callback(quiz);
    }).catch((err) => {
        throw err;
    })
}

let roomControl = new RoomControl();
let room = {};
Io.of('/game').on('connection', (socket) => {
    console.log('Bağlandı');
    socket.emit('connected');
    const io = Io.of('/game');
    socket.on('sendPin', (pin) => {
        pinControl(pin, (quiz) => {
            socket.join(pin, () => {
                //roomName alınıyor
                const roomName = Object.keys(socket.rooms)[0];
                //UserId alınıyor
                const userId = Object.keys(socket.rooms)[1];
                //odaya girdiğine dair bilgi
                console.log("roomName: "+roomName);
                socket.emit('join', { status: true });
                //username girdiğininde bu kontroller çalışacak otomatik.
                socket.on('sendUsername', (username) => {
                    // gelen kullanıcıyı id ve hangi roomName sahip olduğunu ve kullanıcı adı ile kaydediyor.
                    roomControl.addUser(userId, roomName, username);
                    //player ekranında tüm kullanıcılar görünüyor
                    io.to(pin).emit('newUser', roomControl.getUserNames(roomName));
                    //client kısmında başla komutu geldiğinde işleyecek.
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
                        console.log(roomControl.getRoom(roomName));
                    });

                    socket.on('disconnect', () => {
                        roomControl.roomUserDelete(roomName, userId);
                        io.to(pin).emit('newUser', roomControl.getUserNames(roomName));
                    });

                });quiz

                // soruları tek tke gönder ve herkese socket.io şeklinde gönder.
            });

        });

    });
    socket.on('sendAdmin', (pin) => {
        console.log(pin);
       
        //Odayı kontrol edebilmek için roomControl sınıfına atanıyor
        pinActive(pin, (quiz) => {
            socket.join(pin, () => {
                const roomName = Object.keys(socket.rooms)[0];
                room = roomControl.getRoom(roomName);
                
                socket.on('startGame', () => {
                    //ilk soru ekleniyor.
                    roomControl.setQuiz(roomName, quiz);
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
                            if (room.quiz.question.length !== question) {
                                nextQuestion();
                            }
                        }, 5000);

                    }, room.currentQuestion.time * 1000);
                }
            })
        });
    })
});


Io.of('/profil').use((socket, next) => {
    const token = socket.handshake.query.token
    jwt.verify(token, key, (err, decoded) => {
        if (err) {
            console.log(err);
            next(new Error('Authentication error'));
        } else {
            socket.decoded = decoded
            return next();
        }
    });
}).on('connection', (socket) => {

    socket.on('quizCreate', (quiz) => {
        quiz.userId = socket.decoded.userId;
        const promise = new Quiz(quiz)
        promise.save()
            .then((data) => {
                socket.emit('quizId', data._id);
            }).catch((err) => {
                socket.emit('quizError', message = "Ne yaptın Emmi");
            });
    });

    socket.on('getProfilInfo', () => {
        User.findById(socket.decoded.userId, (err, user) => {
            if (err)
                throw err
            socket.emit('setProfilInfo', { username: user.username, userId: user._id, firstname: user.firstname, lastname: user.lastname });
            Quiz.find({ userId: user._id }, (err, res) => {
                const quizs = [];
                res.forEach((quiz) => {
                    quizs.push({
                        title: quiz.title,
                        description: quiz.description,
                        img: quiz.img,
                        userId: quiz.userId,
                        pin: quiz.pin
                    });
                });
                socket.emit('profilQuiz', quizs);
            })
        });
    });

    socket.on('addingQuestions', (question) => {
        Quiz.findById(question.quizId, (err, res) => {
            if (err)
                throw err;
            delete question.quizId
            res.question.push(question);
            res.save();
            socket.emit('newQuestionCreate');
        });
    });



});

Io.of('/user').on('connection', (socket) => {

    socket.on('userLogin', (email, password) => {
        User.findOne({
            email
        }, (err, user) => {
            if (err)
                throw err
            if (!user) {
                socket.emit('UnsuccLogin');
            } else {
                bcrypt.compare(password, user.password).then((result) => {
                    if (!result) {
                        //yanlış giriş
                        socket.emit('UnsuccLogin');
                    } else {
                        const payload = {
                            userId: user._id,
                        }
                        const token = jwt.sign(payload, key);
                        socket.emit('succLogin', token);
                    }
                });
            };
        });

    });


    socket.on('userRegister', (email, password, username) => {
        bcrypt.hash(password, 10).then((hash) => {
            const user = new User({
                email,
                username,
                password: hash
            });
            user.save().then((data) => {
                console.log(data);
            }).catch((err) => {
                console.log(err);
            });
        })
    });


})

// {
//   "title": "Ankara",
//   "description": "Sorularla Ankarayı tanıyalım",
//   "location": "Turkey",
//   "language": "Turkish",
//   "pin": 765221,
//   "img": "img1.jpg",
//   "question": []
// }


module.exports = socketApi;