const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = require('../models/User');
const { check, validationResult } = require('express-validator');
var multer = require('multer');
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads');
    },
    filename: function (req, file, cb) {
        cb(null, 'ProfileImage-' + Date.now());
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

router.post('/', ensureAuthenticated, upload.single('fileToUpload'), (req, res, next) => {

    const { email, password1, password2, firstname, lastname, username } = req.body;
    var Errors = [];
    if (req.user && req.user.username) {
        User.findOne({ username: req.user.username }, (err, data) => {
            if (err) {
                console.error(err);
                return res.redirect("/edit");
            }
            if (req.file) {
                data.imgURL = req.file ? "uploads\\" + req.file.filename : "noImage.jpg";
                data.save();
            }
        });

        User.findOne({ username: req.user.username }, (err, data) => {
            if (err) {
                console.error(err);
                return res.redirect("/edit");
            }
            if (username && username != "")
                data.username = username;
            if (firstname && firstname != "")
                data.firstname = firstname;
            if (lastname && lastname != "")
                data.lastname = lastname;
            if (password1 && password1 != "") {
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
            if (email && email != "") {
                User.find({ email: email }, (err, d) => {
                    if (err)
                        console.log(err);
                    if (d.length <= 0) {
                        data.email = email;
                    }
                    else {
                        console.log('exist');
                        Errors.push({ msg: "Given email is already used!" });
                    }
                    if (Errors.length == 0) {
                        data.save();
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

module.exports = router;