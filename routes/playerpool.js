var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.send('Here is the player pool who is gonnna play!');
});

module.exports = router;