var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.send('Your Profile is shown here!');
});

module.exports = router;