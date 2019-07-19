const express = require('express');
const router = express.Router();

/* GET home page. */
<<<<<<< HEAD
router.get('/', (req, res, next) => {
  res.render('index', { title: 'Express' });
=======
router.get('/', function(req, res, next) {
  res.render('index');
>>>>>>> e8fe02d51e351a41e23d87dad11f627f09b5dce6
});

router.post('/', (req, res) => {

  // aktif oyun varsa ona yönlendirecek

});

module.exports = router;
