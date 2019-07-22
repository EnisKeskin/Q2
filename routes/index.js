const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const quiz = require('../models/Quiz');

router.get('/', (req, res, next) => {
    res.json('Enis');
});


module.exports = router;
