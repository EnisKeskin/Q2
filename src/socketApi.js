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


class RoomControl {
    constructor() {
        this.rooms = {};
        this.userCount = 0;
        this.nextQuestionTime = null;
        this.showAnswerTime = null;
        this.socketAdmin = '';
        this.socketPlayer = '';
    }

    addUser(userId, roomName, username) {
        const room = this.getRoom(roomName);

        room.users[userId] = {
            username: username,
            totalPoint: 0,
            answers: [],
        };
    }

    getRoom(roomName, reset) {
        let room = {};
        if (reset === true) {
            room = {
                quiz: null,
                startTime: null,
                currentQuestion: null,
                currentQuestionIndex: -1,
                users: {},
            }
        } else {
            room = this.rooms[roomName] ?
                this.rooms[roomName] : {
                    quiz: null,
                    startTime: null,
                    currentQuestion: null,
                    currentQuestionIndex: -1,
                    users: {},
                }
        }
        this.rooms[roomName] = room;
        return room;
    }

    setQuiz(roomName, quiz) {
        this.getRoom(roomName).quiz = quiz
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
    };

    roomUserDelete(roomName, userId) {
        delete this.getRoom(roomName).users[userId];
    };

    getUserNames(roomName) {
        let usernames = [];
        let room = this.getRoom(roomName)
        Object.keys(room.users).forEach((userId) => {
            usernames.push(room.users[userId].username)
        });
        if (usernames.length > 0)
            return usernames;
        else null
    };

    nextQuestion(roomName) {
        const room = this.getRoom(roomName);
        if (room) {
            room.currentQuestionIndex += 1;
            if (room.currentQuestionIndex > room.quiz.question.length) {
                return null;
            }
            room.currentQuestion = room.quiz.question[room.currentQuestionIndex];
            room.startTime = Date.now();
            return room.currentQuestion;
        } else {
            throw "Unknow Error"
        }
    };

    resetRoom(roomName) {
        const room = this.getRoom(roomName);
        room.currentQuestion = null;
        room.currentQuestionIndex = -1;
    };
}

const pinControl = (data, callback) => {
    if (data) {
        Quiz.findOne({ pin: data, active: true }, (err, res) => {
            if (err) {
                callback(0);
            } else {
                if (res) {
                    callback(res);
                } else {
                    callback(0);
                }
            }
        })
    }
}

const pinActive = (data, callback) => {
    Quiz.findOneAndUpdate({ pin: data }, { active: true }, (err, quiz) => {
        if (err) {
            console.log(err)
        } else {
            callback(quiz);
        }
    })
}

const pinDeactivate = (data) => {
    Quiz.updateOne({ pin: data }, { active: false }, (err, res) => {
        if (err)
            console.log(err);
    })
}

const error = (err, socket) => {
    for (d in err.errors) {
        let error = err.errors[d]
        const objectKey = error.path[0].toUpperCase() + error.path.slice(1, (error.path.length));
        const isValidationError = err.name == 'ValidationError';

        let validationMessage = {};

        if (isValidationError && error.kind == 'required') {
            validationMessage = { message: objectKey + ' field required' };
        }

        if (isValidationError && error.kind == 'maxlength') {
            validationMessage = { message: objectKey + ` longer than the maximum allowed length ${error.properties.maxlength}` };

        } else if (isValidationError && error.kind == 'minlength') {
            validationMessage = { message: objectKey + ` longer than the min allowed length ${error.properties.minlength} ` };
        }

        if (isValidationError && error.kind == 'required' && error.path == 'answer') {
            validationMessage = { message: 'You must choose the right answer' };
        }

        socket.emit('errors', validationMessage);

    }
}

const objectTrim = (object) => {
    Object.keys(object).forEach(item => {
        if (typeof (object[item]) === 'string') {
            object[item] = object[item].trim()
        }
    });
}

const login = (user, socket) => {
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

const deleteFolder = (img, quiz) => {
    if (quiz) {
        quiz.question.forEach((question) => {
            const img = question.img.split('/');
            if (typeof (img[1]) !== 'undefined') {
                rimraf.sync('media' + path.join(`/${img[1]}`));
            }
        })
        if (typeof (img) !== 'undefined') {
            rimraf.sync('media' + path.join(`/${img}`));
        }
    } else {
        if (typeof (img) !== 'undefined') {
            rimraf.sync('media' + path.join(`/${img}`));
        }
    }

}

const reloadUser = (socket) => {
    socket.emit('gameStop');
}

let roomControl = new RoomControl();
let room = {};
Io.of('/game').on('connection', (socket) => {
    socket.emit('connected');
    const io = Io.of('/game');
    socket.on('sendPin', (pin) => {
        this.socketPlayer = socket;
        pinControl(pin, (quiz) => {
            if (quiz !== 0) {
                socket.join(pin, () => {
                    this.socketPlayer = socket;
                    const roomName = Object.keys(socket.rooms)[0];
                    const userId = Object.keys(socket.rooms)[1];
                    const socketRooms = socket.adapter.rooms[roomName];
                    const userCount = socketRooms.length;
                    roomControl.userCount = userCount;
                    socket.emit('join', { status: true });
                    socket.on('sendUsername', (username) => {
                        if (typeof (username) !== 'undefined' && username.trim() !== '') {
                            socket.emit('start');

                            roomControl.addUser(userId, roomName, username);

                            io.to(pin).emit('newUser', roomControl.getUserNames(roomName));

                            socket.emit('quizPin', { pin });

                            socket.on('sendAnswer', (user) => {
                                const room = roomControl.getRoom(roomName)
                                let questionScore = 0
                                if (user.answer === null) {
                                    user.answer = -1;
                                }
                                if (user.answer === room.currentQuestion.answer) {
                                    questionScore = Math.floor((1000 - ((Date.now() - room.startTime) / 10)));
                                    questionScore = Math.max(100, questionScore);
                                }
                                roomControl.addAnswer(roomName, userId, user.answer, questionScore, room.currentQuestion.answer);
                            });

                            socket.on('disconnect', () => {
                                roomControl.roomUserDelete(roomName, userId);
                                io.to(pin).emit('newUser', roomControl.getUserNames(roomName));
                                if (typeof (socketRooms) === 'undefined') {
                                    clearTimeout(roomControl.nextQuestionTime);
                                    clearTimeout(roomControl.showAnswerTime);
                                }
                            });

                        } else {
                            socket.emit('usernameErr', message = 'The username field cannot be left blank')
                        }
                    });
                });
            } else {
                socket.emit('join', { status: false });
            }

        });

    });
    socket.on('sendAdmin', (pin) => {
        pinActive(pin, (quiz) => {
            socket.join(pin, () => {
                this.socketAdmin = socket;
                const roomName = Object.keys(socket.rooms)[0];
                const socketRooms = socket.adapter.rooms[roomName];
                const userCount = socketRooms.length;
                roomControl.userCount = userCount
                if (roomControl.userCount > 0) {
                    roomControl.getRoom(roomName, true)
                    room = roomControl.getRoom(roomName);
                    socket.emit('startButton', pin);
                    socket.on('startGame', async (userCount) => {
                        if (userCount > 0) {
                            await pinDeactivate(pin);
                            await roomControl.setQuiz(roomName, quiz);
                            await io.to(pin).emit('gameStart');
                            await roomControl.resetRoom(roomName);
                            room.currentQuestion = null;
                            nextQuestion();
                        } else {
                            socket.emit('gameStartError', 'Cannot start game without player')
                        }
                    });
                    let answernumber = 0;
                    const nextQuestion = () => {
                        if (socketRooms) {
                            if (userCount > 0) {
                                const question = roomControl.nextQuestion(roomName);
                                if (!question) {
                                    io.to(roomName).emit('showScoreboard');
                                    io.to(roomName).emit('Scoreboard', roomControl.top5(roomName));
                                    if (typeof (socketRooms) === 'undefined') {
                                        clearTimeout(roomControl.nextQuestionTime);
                                        clearTimeout(roomControl.showAnswerTime);
                                    }
                                    return;
                                }
                                io.to(roomName).emit('newQuestion', question);

                                roomControl.nextQuestionTime = setTimeout(() => {
                                    let answStatic = []
                                    Object.keys(room.users).forEach((userId) => {
                                        let userAnswer = room.users[userId].answers[answernumber];
                                        if (typeof (userAnswer) === 'undefined') {
                                            userAnswer = { answer: -1, score: 0 }
                                        }
                                        answStatic.push(userAnswer);
                                    });
                                    answernumber++;
                                    io.to(roomName).emit('staticstics', answStatic);

                                    roomControl.showAnswerTime = setTimeout(() => {

                                        if (room.quiz !== null) {
                                            if (room.quiz.question.length !== question) {
                                                nextQuestion();
                                            }
                                        }
                                    }, 5000);

                                }, room.currentQuestion.time * 1000);
                            }
                        }
                    }
                }
                socket.on('disconnect', () => {
                    clearTimeout(roomControl.nextQuestionTime);
                    clearTimeout(roomControl.showAnswerTime);
                    reloadUser(this.socketPlayer);
                });
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
        const pinCreate = () => {
            let randomKey = 0;
            randomKey = Math.floor(Math.random() * 100000) + 100000;
            Quiz.findOne({ pin: randomKey }).then((data) => {
                if (data) {
                    pinCreate()
                } else {
                    quiz.userId = socket.decoded.userId;
                    quiz.pin = randomKey;
                    objectTrim(quiz);
                    new Quiz(quiz).save((err, quiz) => {
                        if (err) {
                            error(err, socket);
                        } else {
                            socket.emit('quizId', quiz._id);
                        }
                    });
                }
            });
        };
        pinCreate();
    });

    socket.on('reqQuizInfo', (quizId) => {
        Quiz.findById(quizId, (err, quiz) => {
            if (err) {
                console.log(err)
            }
            socket.emit('sendQuizInfo', quiz);
        });
    });

    socket.on('quizDel', (quizId) => {
        Quiz.findById(quizId, (err, quiz) => {
            if (err)
                throw err
            if (quiz !== null) {
                if (quiz.img) {
                    const img = quiz.img.split('/');
                    deleteFolder(img[1], quiz);
                }
                Quiz.findByIdAndDelete(quizId, (err, result) => {
                    if (err)
                        throw err
                })
            }
        });
    });

    socket.on('quizUpdate', (quiz) => {
        Quiz.findByIdAndUpdate(quiz._id,
            {
                $set: {
                    title: quiz.title,
                    description: quiz.description,
                    location: quiz.location,
                    language: quiz.language,
                    visibleTo: quiz.visibleTo,
                },
            },
            {
                runValidators: true
            },
            (err, result) => {
                if (err) {
                    error(err, socket)
                } else {
                    socket.emit('quizUpdateFile');
                    socket.emit('quizUpdateSuccess', "Quiz Update Successful");
                }
            })
    });

    socket.on('getProfilInfo', () => {
        User.findById(socket.decoded.userId, (err, user) => {
            if (err) {
                console.log(err);
            } else {
                if (user) {

                    socket.emit('setProfilInfo', { username: user.username, userId: user._id, firstname: user.firstname, lastname: user.lastname, img: user.img });
                    Quiz.aggregate([
                        {
                            $match: {
                                userId: mongoose.Types.ObjectId(user._id)
                            }
                        },
                        { $sort: { date: -1 } },
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
                            }
                        },
                    ], (err, result) => {
                        if (err)
                            throw err
                        socket.emit('profilQuiz', result);
                    });
                }
            }
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
        objectTrim(user);
        const loginEditValidations = (message) => { socket.emit('errors', { message }) }
        if (user.email !== '' && user.username !== '' && user.firstname !== '') {
            if (user.email.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)) {
                if (user.password !== null) {
                    User.findById(socket.decoded.userId, (err, UserProfil) => {
                        if (err)
                            throw err
                        bcrypt.compare(user.password, UserProfil.password).then((newPassword) => {
                            if (!newPassword) {
                                loginEditValidations('Password incorrect');
                            } else {
                                if (typeof (user.newPassword) !== 'undefined') {
                                    if (user.newPassword.length >= 6) {
                                        bcrypt.hash(user.newPassword, 10).then((hash) => {
                                            User.findByIdAndUpdate(socket.decoded.userId, {
                                                email: user.email,
                                                username: user.username,
                                                firstname: user.firstname,
                                                lastname: user.lastname,
                                                password: hash
                                            }, (err, result) => {
                                                if (err) {
                                                    error(err, socket)
                                                } else {
                                                    socket.emit('file', { userId: socket.decoded.userId });
                                                    socket.emit('successfulUpdate', { message: " Successfully updated " });
                                                }
                                            })

                                        })
                                    } else {
                                        loginEditValidations('Password length must be at least 6 characters');
                                    }
                                } else {
                                    User.findByIdAndUpdate(socket.decoded.userId, {
                                        email: user.email,
                                        username: user.username,
                                        firstname: user.firstname,
                                        lastname: user.lastname,
                                    }, (err, result) => {
                                        if (err) {

                                            if (err.code === 11000) {
                                                let i = 0;
                                                let index = '';
                                                while (true) {
                                                    if (err.errmsg.charAt(55 + i) !== '_') {
                                                        index += err.errmsg.charAt(55 + i);
                                                        i++;
                                                    } else {
                                                        break;
                                                    }
                                                }
                                                loginEditValidations(`This ${index} has already been saved`);
                                                error(err, socket);
                                            }
                                        } else {
                                            socket.emit('file', { userId: socket.decoded.userId });
                                            socket.emit('successfulUpdate', { message: " Successfully updated " });
                                        }
                                    });
                                }

                            }
                        });
                    });
                } else {
                    loginEditValidations('Password field cannot be left blank');
                }
            } else {
                loginEditValidations('Please enter a valid email address');
            }
        } else {
            loginEditValidations('Email, Username and Firstname cannot be left empty');
        }
    });

    socket.on('addingQuestions', (question) => {
        let validationMessage = (message) => { socket.emit('errors', { message }) };
        let checkAnswers = true;
        objectTrim(question);
        question.answers.forEach((answer, key) => {
            if (answer.length > 100) {
                validationMessage(`Answer ${key + 1} longer than the max allowed length 100`);
                checkAnswers = false;
            } else {
                if (answer.trim() === '' && checkAnswers) {
                    validationMessage(`Answer ${key + 1} field cannot be left blank`);
                    checkAnswers = false;
                } else {
                    question.answers[key] = answer.trim();
                }
            }
        });
        if ((checkAnswers)) {

            if (question.time >= 10) {

                Quiz.findById(question.quizId, (err, quiz) => {
                    if (err)
                        throw err
                    delete question.quizId;
                    quiz.question.push(question);
                    quiz.save((err, res) => {
                        if (err) {
                            error(err, socket)
                        } else {
                            socket.emit('newQuestionCreate', { questionId: quiz.question[quiz.question.length - 1]._id, questionCount: res.question.length });
                        }
                    });
                });

            } else {
                validationMessage('You should choose a time');
            }
        }
    });

    socket.on('questionDelete', (questionId) => {
        Quiz.findOne({ 'question._id': questionId }, (err, res) => {
            if (err)
                console.log(err)
            res.question.forEach((quest) => {
                if (quest._id == questionId) {
                    const img = quest.img.split('/');
                    if (typeof (img[1]) !== 'undefined') {
                        rimraf.sync('media' + path.join(`/${img[1]}`));
                    }
                }
            })
            Quiz.updateOne(
                { 'question._id': mongoose.Types.ObjectId(questionId) },
                {
                    '$pull': { question: { _id: mongoose.Types.ObjectId(questionId) } },
                },
                (err, result) => {
                    if (err)
                        console.log(err)
                })
        });
    });

    socket.on('reqQuestionInfo', (questionId) => {
        Quiz.findOne({ 'question._id': questionId }, (err, res) => {
            if (err)
                console.log(err)
            res.question.forEach((quest) => {
                if (quest._id == questionId) {
                    socket.emit('sendQuestionInfo', quest);
                }
            })
        })
    })

    socket.on('questionUpdate', (question) => {
        let validationMessage = (message) => { socket.emit('errors', { message }) };
        let checkAnswers = true;
        objectTrim(question);
        question.answers.forEach((answer, key) => {
            if (answer.trim() === '' && checkAnswers) {
                validationMessage(`Answer ${key + 1} field cannot be left blank`);
                checkAnswers = false;
            } else {
                question.answers[key] = answer.trim();
            }
        });
        if (checkAnswers) {
            if ((question.time >= 10)) {
                Quiz.updateOne(
                    { 'question._id': question._id },
                    {
                        '$set': {
                            'question.$.answers': question.answers,
                            'question.$.time': question.time,
                            'question.$.questionTitle': question.questionTitle,
                            'question.$.answer': question.answer,
                        },
                    },
                    {
                        runValidators: true
                    },
                    (err, result) => {
                        if (err)
                            error(err, socket);
                        socket.emit('questionUpdateImg', { questionId: question._id });
                        socket.emit('questUpdateSuccess', msg = 'Question Update Successful');
                    })
            } else {
                validationMessage('You should choose a time');
            }
        };
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
            socket.emit('setDiscover', result);
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

    socket.on('questionCount', (quizId) => {
        Quiz.findById(quizId, (err, res) => {
            if (err) {
                console.log(err);
            } else {
                socket.emit('sendQuestionCount', res.question.length)
            }
        })
    });

    socket.on('userDeleteImg', (userId) => {
        User.findById(userId, (err, res) => {
            if (err) {
                console.log(err);
            } else {
                if ((res.img !== '' || typeof (res.img) !== 'undefined') || res.img !== null) {
                    const img = res.img.split('/');
                    if (img) {
                        deleteFolder(img[1]);
                    }
                }
            }
        });
    });

    socket.on('quizDeleteImg', (quizId) => {
        Quiz.findById(quizId, (err, res) => {
            if (err) {
                console.log(err);
            } else {
                if (res.img !== '') {
                    const img = res.img.split('/');
                    if (img) {
                        deleteFolder(img[1]);
                    }
                }
            }
        });
    });

    socket.on('questionDeleteImg', (questionId) => {
        Quiz.findOne({ 'question._id': questionId }, (err, res) => {
            if (err) {
                console.log(err);
            } else {
                res.question.forEach((question) => {
                    if (question._id == questionId) {
                        const img = question.img.split('/');
                        if (img) {
                            deleteFolder(img[1]);
                        }
                    }
                });
            }
        })
    })
});

Io.of('/user').on('connection', (socket) => {
    socket.on('userLogin', (user) => {
        objectTrim(user);
        if (user.email.trim() !== '' && user.password !== '') {
            if (user.email.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)) {
                login(user, socket)
            } else {
                socket.emit('loginErr', { message: "Please enter a valid email address" });
            }
        }
        else {
            socket.emit('loginErr', { message: "Email or Password field cannot be left blank" });
        }
    });
    socket.on('userRegister', (user) => {
        objectTrim(user)
        const registerValidations = (message) => { socket.emit('registerError', { message }) }
        if ((user.email !== '') && (user.password !== '') && (user.username !== '') && (user.firstname !== '') && (user.lastname !== '')) {
            if (user.email.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)) {
                if (user.password.length >= 6) {
                    bcrypt.hash(user.password, 10).then((hash) => {
                        const userRegister = new User({
                            email: user.email,
                            username: user.username,
                            firstname: user.firstname,
                            lastname: user.lastname,
                            password: hash
                        });
                        userRegister.save((err, res) => {
                            if (err) {
                                if (err.code === 11000) {
                                    let i = 0;
                                    let index = '';
                                    while (true) {
                                        if (err.errmsg.charAt(55 + i) !== '_') {
                                            index += err.errmsg.charAt(55 + i);
                                            i++;
                                        } else {
                                            break;
                                        }
                                    }
                                    registerValidations(`This ${index} has already been saved`);
                                    error(err, socket);
                                }
                            } else {
                                socket.emit('registerSuccessful', message = 'Successfully registered \n You will be redirected in 1 second');
                                setTimeout(() => {
                                    login(user, socket)
                                }, 1000);
                            }

                        })
                    })
                } else {
                    registerValidations('Password length must be at least 6 characters')
                }
            } else {
                registerValidations('Please enter a valid email address')
            }
        }
        else {
            registerValidations('All fields are mandatory')
        }
    });
})

module.exports = socketApi;