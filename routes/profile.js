const express = require('express');
const router = express.Router();

router.get('/', function(req, res, next) {
  res.send('Your Profile is shown here!');
});

module.exports = router;