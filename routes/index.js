const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

router.post('/', (req, res) => {

  // aktif oyun varsa ona yönlendirecek

});

module.exports = router;
