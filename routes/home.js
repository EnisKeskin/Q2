const express = require('express');
const router = express.Router();

router.get('/', ensureAuthenticated, (req, res, next) => {
  res.render('home',{
    myQuizzes:[
      {
        img:"",
        title:"",
        desc:"",
        pin:0,
        index:0
      },{
        img:"",
        title:"",
        desc:"",
        pin:0,
        index:1
      }
    ],
    quizCreated:0,
    gamePlayed:0,
    img:"",
    firstname:"",
    lastname:"",
    username:""
  });
});

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect('/');
}

module.exports = router;