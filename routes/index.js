const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const User = require('../models/User');
const quiz = require('../models/Quiz');


router.get('/', (req, res, next) => {
    res.json({ status: 1 });
});

//soruyu bulmak için
router.post('/quiz', (req, res) => {
    const promise = quiz.find({ pin: req.body.pin });

    promise.then((data) => {
        res.json(data);
    }).catch((err) => {
        res.json(err);
    });

});
//quiz eklemek için
router.post('/', (req, res) => {
    const quiz = new Quiz(req.body);
    const promise = quiz.save();

    promise.then((data) => {
        res.json({ status: 1 })
    }).catch((err) => {
        res.json({ err });
    })

})
//soruyu eklemek için
router.post('/question', (req, res) => {
    const question = req.body;
    Quiz.findById(question.quiz_id, (err, data) => {
        if (err)
            throw err;

        data.question.push(question);
        data.save();
    });
})

//kayıt için
router.post('/register', (req, res, next) => {
    const { email, password, firstname, lastname, username } = req.body;
    bcrypt.hash(password, 10).then((hash) => {
        const user = new User({
            email,
            firstname,
            lastname,
            username,
            password: hash
        });
        const promise = user.save();

        promise.then((data) => {
            res.json({ status: 1 });
        }).catch((err) => {
            res.json(err);
        });

    })
});
//giriş için
router.post('/login', (req, res) => {
    const { email, password } = req.body;

    User.findOne({
        email
    }, (err, user) => {
        if (err)
            throw err
        if (!user) {
            res.json({ status: 0 })
        } else {
            bcrypt.compare(password, user.password).then((result) => {
                if (!result) {
                } else {
                }
            });
        };
    });
});

module.exports = router;

// {
//   "title": "Ankara",
//   "description": "Sorularla Ankarayı tanıyalım",
//   "location": "Turkey",
//   "language": "Turkish",
//   "pin": 765221,
//   "img": "img1.jpg",
//   "question": []
//   "active":true  -> oyun şu anda oynanma aşamasında
// }


// question{
//   "questionTitle": "Ankaranın ilkleri",
//   "answers": [
//     "ali",   //answer-1
//     "veli",  //answer-2
//     "49",    //answer-3
//     "50"     //answer-4
//    ],  
//   "answer": "2",
//   "time": 10,
//   "img": "s-img1.jpg",
//   "quiz_id": "5d305364629fa117538a58e8"
// }