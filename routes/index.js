const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const quiz = require('../models/Quiz');

<<<<<<< HEAD
router.get('/', (req, res, next) => {
=======
/* GET home page. */
router.get('/', function(req, res, next) {
>>>>>>> 2258647b2a62a25e91ea79125016a6abb11459c6
  res.render('index');
});

// aktif oyun varsa ona yönlendirecek
router.post('/', (req, res) => {
  const promise = quiz.find({pin: req.body.pin, active: true});

  promise.then((data) => {
    if(data.length != 0){
      res.render('index', data)
    }else {
      res.render('index', {status : 0 , message: "Oyun aktif değil veye Pin yanlış"})
    }
  }).catch((err) => {
    res.json(err);
  });

});

module.exports = router;

//render aslında gönderdiğimiz değişkenleri ekrana basar.
//
