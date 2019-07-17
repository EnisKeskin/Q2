const express = require('express');
const router = express.Router();

router.get('/', function(req, res, next) {
  res.send('Add a question!');
});

module.exports = router;