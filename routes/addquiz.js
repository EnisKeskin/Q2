var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.send('Add a quiz!');
});

module.exports = router;