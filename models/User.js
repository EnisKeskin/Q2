const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');

const userShema = new Schema ({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        minlength: 8
    },
    username: {
        type: String,
        required: true,
        maxlength: 50,
        unique: true
    },
    firstname: {
        type: String,
        maxlength: 50
    },
    lastname: {
        type: String,
        maxlength: 50
    },
    imgURL: {
        type: String
    }
})

var User = module.exports = mongoose.model('user', userShema);

module.exports.getUserById = (id, callback) => {
    User.findById(id, callback);
};

module.exports.getUserByUsername = (username, callback) => {
    var query = { username: username };
    User.findOne(query, callback);
};

module.exports.comparePassword = (cPassport, hash, callback) => {
    bcrypt.compare(cPassport,hash,(err,isMatch)=>{
        callback(null,isMatch);
    });
};