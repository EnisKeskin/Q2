const express = require('express');
const router = express.Router();

router.get('/', function(req, res, next) {
  res.send('Find a quiz to solve!');
});

module.exports = router;