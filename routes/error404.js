const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
    res.render('error404');
});
module.exports = router;