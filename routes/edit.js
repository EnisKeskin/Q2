const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = require('../models/User');
const { check, validationResult } = require('express-validator');
var multer = require('multer');
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads/profile');
    },
    filename: function (req, file, cb) {
        cb(null, 'QuizImage-' + Date.now());
    }
});
var upload = multer({ storage: storage });

router.get('/', ensureAuthenticated, (req, res, next) => {
    res.render('edit');
});

function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) return next();
    res.redirect('/');
}

router.post('/', (req, res, next) => {
    const { email, password1, password2, firstname, lastname, username } = req.body;
    var Errors = [];
    if (req.user && req.user.username) {
        User.findOne({ username: req.user.username }, (err, data) => {
            if (err)
                throw err;
            if (username != "")
                data.username = username;
            if (firstname != "")
                data.firstname = firstname;
            if (lastname != "")
                data.lastname = lastname;
            if (password1 != "") {
                if (password1.length >= 8)
                    if (password1 == password2)
                        bcrypt.hash(password1, 10).then((hash) => {
                            data.password = hash;
                        });
                    else
                        Errors.push({ msg: "Given passwords do not match!" });
                else
                    Errors.push({ msg: "Please provide a password with minimum lenght of 8!" });
            }
            if (email != "") {
                User.find({ email: email }, (err, d) => {
                    if (err)
                        console.log(err);
                    if (d.length <= 0) {
                        data.email = email;
                        console.log('email:' + email);
                    }
                    else {
                        console.log('exist');
                        Errors.push({ msg: "Given email is already used!" });
                    }
                    if (Errors.length == 0) {
                        data.save();
                        next();
                    }
                    else {
                        console.log("Errors:" + Errors);
                        res.render('edit', { "Errors": Errors });
                    }
                });
            }
            else {
                if (Errors.length == 0) {
                    data.save();
                    next();
                }
                else {
                    console.log("Errors:" + Errors);
                    res.render('edit', { "Errors": Errors });
                }
            }
        });
    }
    else
        res.redirect('/');
});

router.post('/', upload.single('uploadToFile'), (req, res, next) => {
    if (!req.file) {
        res.render('edit');
    }
    else if (req.user && req.user.username) {
        User.findOne({ username: req.user.username }, (err, data) => {

        });
    }
    else {
        res.render('/');
    }
});

module.exports = router;