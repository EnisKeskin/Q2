const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

router.get('/', function(req, res, next) {
  res.send('Add a quiz!');
});

module.exports = router;