var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.send('Top 10!');
});

module.exports = router;