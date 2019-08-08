const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = require('../models/User');
const { check, validationResult } = require('express-validator');

router.get('/', ensureAuthenticated, (req, res, next) => {
    res.render('edit');
});

function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) return next();
    res.redirect('/');
}

router.post('/', (req, res, next) => {
    const { email, password1, password2, firstname, lastname, username } = req.body;
    User.find({ username: req.user.username }, (err, datas) => {
        if (err)
            throw err;
        if (datas.length > 0) {
            var data = datas[0];
            var iserror = false;
            if (email != "") {
                User.find({ email: email }, (err, d) => {
                    if (d.length <= 0)
                        data.email = email;
                    else {
                        iserror = true;
                        res.render('edit', { Errors: [{ msg: "Given email is already used!" }] });
                    }
                });
            }
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
                    else {
                        iserror = true;
                        res.render('edit', { Errors: [{ msg: "Given passwords do not match!" }] });
                    }
                else {
                    iserror = true;
                    res.render('edit', { Errors: [{ msg: "Please provide a password with minimum lenght of 8!" }] });
                }
            }
            if (!iserror) {
                data.save();
                res.render('edit');
            }
        }
        else
            res.render('edit');
    });
});

module.exports = router;