const socketio = require('socket.io');
const socketApi = {};
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Quiz = require('../models/Quiz');
const jwt = require('jsonwebtoken');
const key = require('../config').api_top_secret_key;
const Io = socketio();
socketApi.io = Io;

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
        let room = this.rooms[roomName] ?
            this.rooms[roomName] : {
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

const pinControl = (data, callback) => {
    if (data) {
        Quiz.find({ pin: data, active: true })
            .then((data) => {
                if (data[0]) {
                    callback(data);
                } else {
                    callback(0);
                }
            }).catch((err) => {
                callback(0);
            });
    }
}

const pinActive = (data, callback) => {
    Quiz.findOneAndUpdate({ pin: data }, { active: true }).then((quiz) => {
        callback(quiz);
    }).catch((err) => {
        // callback(err);
    })
}

const pinDeactivate = (data) => {
    Quiz.updateOne({ pin: data }, { active: false }).then((data) => {
    })
}

const pinCreate = (callback) => {
    let randomKey = 0;
    randomKey = Math.floor(Math.random() * 1000000) + 100000;
    Quiz.findOne({ pin: randomKey }).then((data) => {
        if (data) {
            pinCreate()
        } else {
            callback(randomKey);
        }
    });
}

let roomControl = new RoomControl();
let room = {};
Io.of('/game').on('connection', (socket) => {

    socket.emit('connected');
    const io = Io.of('/game');
    socket.on('sendPin', (pin) => {
        pinControl(pin, (quiz) => {
            if (quiz !== 0) {
                socket.join(pin, () => {
                    //roomName alınıyor
                    const roomName = Object.keys(socket.rooms)[0];
                    //UserId alınıyor
                    const userId = Object.keys(socket.rooms)[1];
                    //odaya girdiğine dair bilgi
                    socket.emit('join', { status: true });
                    //username girdiğininde bu kontroller çalışacak otomatik.
                    socket.on('sendUsername', (username) => {
                        // gelen kullanıcıyı id ve hangi roomName sahip olduğunu ve kullanıcı adı ile kaydediyor.
                        roomControl.addUser(userId, roomName, username);
                        //player ekranında tüm kullanıcılar görünüyor
                        io.to(pin).emit('newUser', roomControl.getUserNames(roomName));
                        socket.emit('quizPin', { pin: socket.adapter.rooms[pin].length - 1, pin });
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
                        });

                        socket.on('disconnect', () => {
                            roomControl.roomUserDelete(roomName, userId);
                            io.to(pin).emit('newUser', roomControl.getUserNames(roomName));
                        });

                    });
                    // soruları tek tke gönder ve herkese socket.io şeklinde gönder.
                });
            } else {
                socket.emit('join', { status: false });
            }

        });

    });
    socket.on('sendAdmin', (pin) => {
        //Odayı kontrol edebilmek için roomControl sınıfına atanıyor
        pinActive(pin, (quiz) => {
            socket.join(pin, () => {
                const roomName = Object.keys(socket.rooms)[0];
                room = roomControl.getRoom(roomName);
                socket.emit('startButton', pin);
                socket.emit('userCount', { userCount: socket.adapter.rooms[pin].length - 1, pin });
                socket.on('startGame', () => {
                    //ilk soru ekleniyor.
                    pinDeactivate(pin);
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
    if (token) {
        jwt.verify(token, key, (err, decoded) => {
            if (err) {
                next(new Error('Authentication error'));
            } else {
                socket.decoded = decoded
                return next();
            }
        });
    } else {
        next(new Error('Authentication error'));
    }
}).on('connection', (socket) => {
    socket.on('quizCreate', (quiz) => {
        console.log(quiz);
        if ((quiz.title !== '') && (quiz.location !== '') && (quiz.language !== '')) {
            pinCreate((randomKey) => {
                quiz.userId = socket.decoded.userId;
                quiz.pin = randomKey;
                new Quiz(quiz).save()
                    .then((quiz) => {
                        socket.emit('quizId', quiz._id);
                    }).catch((err) => {
                        socket.emit('quizError', { message: "Unknown Error" });
                    });
            });
        } else {
            socket.emit('quizError', { message: 'Title, Location, language Cannot Be Left Blank' })
        }
    });

    socket.on('getProfilInfo', () => {
        User.findById(socket.decoded.userId, (err, user) => {
            if (err)
                throw err
            socket.emit('setProfilInfo', { username: user.username, userId: user._id, firstname: user.firstname, lastname: user.lastname });
            Quiz.aggregate([
                {
                    $match: {
                        userId: mongoose.Types.ObjectId(user._id)
                    }
                },
                {
                    $lookup: {
                        from: 'users',
                        localField: 'userId',
                        foreignField: '_id',
                        as: 'user'
                    }
                },
                {
                    $unwind: '$user'
                },
                {
                    $project: {
                        title: 1,
                        description: 1,
                        img: 1,
                        username: '$user.username',
                        pin: 1,
                    }
                },
                { $sort: { date: -1 } },
            ], (err, result) => {
                if (err)
                    throw err
                socket.emit('profilQuiz', result);
            })
        });
    });

    socket.on('addingQuestions', (question) => {
        let boolean = true;
        question.answers.forEach((answer) => {
            if (answer === '') {
                boolean = false;
                return;
            }
        });

        if ((boolean) && (question.questionTitle !== '') && ((question.answer) !== -1) && (question.time > 0)) {
            //validasyonlar yapılacak
            Quiz.findById(question.quizId, (err, quiz) => {
                if (err)
                    throw err
                delete question.quizId
                quiz.question.push(question);
                quiz.save();
                socket.emit('newQuestionCreate', { questionId: quiz.question[quiz.question.length - 1]._id });
            });
        } else {
            socket.emit('questionErr', { message: ' Please Type The Question And Answer, Select The Correct Option' })
        }
    });

    socket.on('getDiscover', (userId) => {
        Quiz.aggregate([
            {
                $lookup: {
                    from: 'users',
                    localField: 'userId',
                    foreignField: '_id',
                    as: 'user'
                }
            },
            {
                $unwind: '$user'
            },
            {
                $project: {
                    title: 1,
                    description: 1,
                    img: 1,
                    username: '$user.username',
                    userImg: '$user.img',
                    pin: 1,
                    questionCount: { $size: '$question' }
                },
            },

        ], (err, result) => {
            if (err)
                throw err
            socket.emit('setDiscoverTrend', result);
        });
        Quiz.aggregate([
            {
                $match: {
                    userId: mongoose.Types.ObjectId(socket.decoded.userId)
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'userId',
                    foreignField: '_id',
                    as: 'user'
                }
            },
            {
                $unwind: '$user'
            },
            {
                $project: {
                    title: 1,
                    description: 1,
                    img: 1,
                    username: '$user.username',
                    userImg: '$user.img',
                    pin: 1,
                    questionCount: { $size: '$question' }
                },
            },

        ], (err, result) => {
            if (err)
                throw err
            socket.emit('setDiscoverMyQuiz', result);
        })
    })

    socket.on('disconnect', () => {
        console.log("at");
    })
});




//login test için hazır
Io.of('/user').on('connection', (socket) => {
    socket.on('userLogin', (user) => {
        console.log(user);
        if (user.email !== null && user.password !== null) {
            User.findOne({
                email: user.email
            }, (err, User) => {
                if (err)
                    throw err
                if (!User) {
                    console.log("at");
                    socket.emit('loginErr', { message: "Email and Password incorrect" });
                } else {
                    bcrypt.compare(user.password, User.password).then((result) => {
                        if (!result) {
                            //yanlış giriş
                            socket.emit('loginErr', { message: " Email or Password incorrect " });
                        } else {
                            const payload = {
                                userId: User._id,
                            }
                            const token = jwt.sign(payload, key);
                            socket.emit('succLogin', token);
                        }
                    });
                };
            });
        } else {
            socket.emit('loginErr', { message: "Email or Password field cannot be left blank" });
        }
    });
    //register test için hazırlanacak
    socket.on('userRegister', (userRegister) => {
        console.log(userRegister);
        if ((userRegister.email !== '') && (userRegister.password !== '') && (userRegister.username !== '') && (userRegister.firstname !== '') && (userRegister.lastname !== '')) {
            bcrypt.hash(userRegister.password, 10).then((hash) => {
                const user = new User({
                    email: userRegister.email,
                    username: userRegister.username,
                    firstname: userRegister.firstname,
                    lastname: userRegister.lastname,
                    password: hash
                });
                user.save().then((data) => {

                }).catch((err) => {

                    console.log(err);
                });
            })
        } else {
            socket.emit('registerError', { message: 'Fields Cannot Be Left Blank' })
        }
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