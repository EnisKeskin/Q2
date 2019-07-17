var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.send('Enter your game pin!');
});

module.exports = router;