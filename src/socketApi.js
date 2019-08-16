const socketio = require('socket.io');
const socketApi = {};
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Quiz = require('../models/Quiz');
const jwt = require('jsonwebtoken');
const key = require('../config').api_top_secret_key;
const Io = socketio();
const path = require('path');
const fs = require('fs');
const rimraf = require('rimraf');
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
                        console.log(username);
                        if (typeof (username) !== 'undefined' && username.trim() !== '') {
                            socket.emit('start')
                            // gelen kullanıcıyı id ve hangi roomName sahip olduğunu ve kullanıcı adı ile kaydediyor.
                            roomControl.addUser(userId, roomName, username);
                            //player ekranında tüm kullanıcılar görünüyor
                            io.to(pin).emit('newUser', roomControl.getUserNames(roomName));

                            socket.emit('quizPin', { pin });
                            //soruya cevap verildiğinde ekleniyor
                            socket.on('sendAnswer', (user) => {
                                //soru geri gönderilirken currentQuestion.time işe yarayacak.
                                let questionScore = 0
                                if (user.answer === null) {
                                    console.log("at");
                                    user.answer = -1;
                                }
                                if (user.answer === roomControl.rooms[roomName].currentQuestion.answer) {
                                    questionScore = Math.floor((1000 - ((Date.now() - roomControl.rooms[roomName].startTime) / 10)));
                                    questionScore = Math.max(100, questionScore);
                                }
                                roomControl.addAnswer(roomName, userId, user.answer, questionScore, roomControl.rooms[roomName].currentQuestion.answer);
                                console.log("roomControl", roomControl);
                            });

                            socket.on('disconnect', () => {
                                roomControl.roomUserDelete(roomName, userId);
                                io.to(pin).emit('newUser', roomControl.getUserNames(roomName));
                            });

                        } else {
                            socket.emit('usernameErr', message = 'The username field cannot be left blank')
                        }
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
                socket.on('startGame', () => {
                    //ilk soru ekleniyor.
                    pinDeactivate(pin);
                    roomControl.setQuiz(roomName, quiz);
                    io.to(pin).emit('gameStart');
                    roomControl.resetRoom(roomName);
                    //soruyu gönderiyor
                    // room resetlenecek bir fonksiyonlana  cak
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
                        console.log("answernumber:", answernumber);
                        console.log("room.user:", room.users);

                        Object.keys(room.users).forEach((userId) => {
                            if (typeof (room.users[userId].answers[answernumber]) === 'undefined') {
                                console.log("attttttttttttttttttttttt");
                                room.users[userId].answers[answernumber] = { answer: -1, score: 0 }
                            }
                            console.log("room.users[userId].answers:", room.users[userId].answers);
                            answStatic.push(room.users[userId].answers[answernumber]);
                            console.log("room.users[userId].answers[answernumber]:", room.users[userId].answers[answernumber]);
                        });
                        answernumber++;
                        console.log("answStatic", answStatic);
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

Io.of('/profile').use((socket, next) => {
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
    socket.use((packet, next) => {
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
    });

    socket.on('quizCreate', (quiz) => {
        console.log(quiz);
        if ((quiz.title.trim() !== '') && (quiz.location.trim() !== '') && (quiz.language.trim() !== '')) {
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
            socket.emit('setProfilInfo', { username: user.username, userId: user._id, firstname: user.firstname, lastname: user.lastname, img: user.img });
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
                        questionCount: { $size: '$question' }
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

    socket.on('getProfileEditInfo', () => {
        User.findById(socket.decoded.userId, (err, user) => {
            if (err)
                throw err
            socket.emit('setProfileEditInfo', user)
        })

    });

    socket.on('profilUpdate', (user) => {
        if (user.email !== '' && user.username !== '' && user.firstname !== '') {

            User.findById(socket.decoded.userId, (err, UserProfil) => {
                if (err)
                    throw err
                bcrypt.compare(user.password, UserProfil.password).then((result) => {
                    if (!result) {
                        //yanlış giriş
                        socket.emit('message', { message: " Password incorrect " });
                    } else {
                        if (typeof (user.newPassword) !== 'undefined') {
                            if (user.newPassword.length >= 6) {
                                bcrypt.hash(user.newPassword, 10).then((hash) => {
                                    User.findByIdAndUpdate(socket.decoded.userId, {
                                        email: user.email.trim(),
                                        username: user.username.trim(),
                                        firstname: user.firstname.trim(),
                                        lastname: user.lastname.trim(),
                                        password: hash
                                    }, (err, result) => {
                                        if (err)
                                            throw err
                                        socket.emit('file', { userId: socket.decoded.userId });
                                        socket.emit('successfulUpdate', { message: " Successfully updated " });
                                    })

                                })
                            } else {
                                socket.emit('message', { message: " Length must be at least 6 characters " });
                            }
                        } else {
                            User.findByIdAndUpdate(socket.decoded.userId, {
                                email: user.email.trim(),
                                username: user.username.trim(),
                                firstname: user.firstname.trim(),
                                lastname: user.lastname.trim(),
                            }, (err, result) => {
                                if (err)
                                    throw err
                                socket.emit('file', { userId: socket.decoded.userId });
                                socket.emit('successfulUpdate', { message: " Successfully updated " });
                            })
                        }

                    }
                });
            })
        } else {
            socket.emit('message', { message: 'Email, username and firstname cannot be left empty!!' })
        }
    });

    socket.on('addingQuestions', (question) => {
        let boolean = true;
        question.answers.forEach((answer, key) => {
            if (answer === '') {
                boolean = false;
                return;
            } else {
                question.answers[key] = answer.trim();
            }
        });

        if ((boolean) && (question.questionTitle.trim() !== '') && ((question.answer) !== -1) && (question.time > 0)) {
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

    socket.on('getDiscover', () => {
        Quiz.aggregate([
            {
                $match: {
                    visibleTo: true
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
    });

    socket.on('quizDel', (quizId) => {
        // rimraf.sync('media' + path.join('/ffb6deaf-7cb7-4077-a196-f99e1b03a9b2'));
        Quiz.findById(quizId, (err, quiz) => {
            if (err)
                throw err
            const img = quiz.img.split('/');
            if (typeof (img[1]) !== 'undefined') {
                rimraf.sync('media' + path.join(`/${img[1]}`));
            }
            quiz.question.forEach((question) => {
                const img = question.img.split('/');
                if (typeof (img[1]) !== 'undefined') {
                    rimraf.sync('media' + path.join(`/${img[1]}`));
                }
            })
            Quiz.findByIdAndDelete(quizId, (err, result) => {
                if (err)
                    throw err
            })
        })
    })

});

//login test için hazır
Io.of('/user').on('connection', (socket) => {

    socket.on('userLogin', (user) => {
        if (user.email.trim() !== null && user.password !== null) {
            User.findOne({
                email: user.email.trim()
            }, (err, User) => {
                if (err)
                    throw err
                if (!User) {
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
    //regex için kontrol sağla
    //şifre 6 karakter olmalı
    socket.on('userRegister', (user) => {
        console.log(user);
        if ((user.email.trim() !== '') && (user.password !== '') && (user.username.trim() !== '') && (user.firstname.trim() !== '') && (user.lastname.trim() !== '')) {
            bcrypt.hash(user.password, 10).then((hash) => {
                const userRegister = new User({
                    email: user.email.trim(),
                    username: user.username.trim(),
                    firstname: user.firstname.trim(),
                    lastname: user.lastname.trim(),
                    password: hash
                });
                userRegister.save().then((userLogin) => {
                    console.log(userLogin);
                    socket.emit('registerSuccessful', message = 'Successfully registered \n You will be redirected in 1 second');
                    setTimeout(() => {
                        if (userLogin.email.trim() !== null && userLogin.password !== null) {
                            User.findOne({
                                email: userLogin.email.trim()
                            }, (err, User) => {
                                if (err)
                                    throw err
                                if (!User) {
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
                        }
                    }, 1000);
                }).catch((err) => {
                    if (err.code === 11000) {
                        socket.emit('registerError', { message: 'This mail has already been saved' })
                    }
                    console.log(err);
                });
            })
        } else {
            socket.emit('registerError', { message: 'Fields Cannot Be Left Blank' })
        }
    });

})

module.exports = socketApi;

//visible to ekle
//trimler eklenecek
//sayfalar boşsa ana ekrana atacak düzeltilmesi
//sadece resim ekleyebilmeli
//profil ekranında sil veya silme diye göstersin quiz için
//admin olarak tek başına başlatılamaması lazım
