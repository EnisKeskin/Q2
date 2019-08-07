const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Quiz = require('../models/Quiz');
const jwt = require('jsonwebtoken');

router.get('/', (req, res, next) => {
    res.json({ status: 1 });
});

//soruyu bulmak için
router.post('/', (req, res) => {
    const promise = Quiz.find({ pin: req.body.pin });

    promise.then((data) => {
        res.json(data);
    }).catch((err) => {
        res.json(err);
    });

});
//quiz eklemek için
router.post('/quiz', (req, res) => {
    const promise = new Quiz(req.body).save();
    promise.then((data) => {
        res.json({ status: 1, id: data._id })
    }).catch((err) => {
        res.json({ err });
    })

})
//soruyu eklemek için
router.post('/question', (req, res) => {
    const question = req.body.question;

    Quiz.findById(question.quizId, (err, resp) => {
        if (err)
            throw err;
        delete question.quizId
        resp.question.push(question);
        resp.save();
        res.json({ status: 1 })
    });
})

//kayıt için
router.post('/register', (req, res) => {
    const { email, password, username } = req.body;
    bcrypt.hash(password, 10).then((hash) => {
        const user = new User({
            email,
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
//ilk girişte 
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
                    //yanlış giriş
                    res.json({ status: 0 })
                } else {
                    const payload = {
                        userId: user._id,
                    }
                    const token = jwt.sign(payload, req.app.get('api_top_secret_key'), {
                        expiresIn: '4320s'
                    });
                    res.json({ user, status: 1, token });
                }
            });
        };
    });
});

router.post('/user', (req, res) => {
    User.findById(req.body.id, (err, user) => {
        if (err)
            throw err
        res.json({ status: 1, user });
    })
})

router.post('/upload', (req, res) => {
    console.log(req.files.theFile.file);
    console.log(req.body.whereToIns);
    if (req.body.whereToIns === 'quiz') {
        Quiz.findByIdAndUpdate({ _id: req.body.quizId }, { img: req.files.theFile.file }).then((data) => {
            res.json('Başarılıyla Eklendi');
        }).catch((err) => {
            res.json(err);
        });
    } else if (req.body.whereToIns === 'question') {
        Quiz.update(
            { 'question._id': req.body.questionId },
            {
                '$set': {
                    'question.$.img': req.files.theFile.file
                }
            },
            (err, result) => {
                if (err)
                    throw err
                console.log(result);
            })
    }
})


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