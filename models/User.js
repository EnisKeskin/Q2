const mongoose = require('mongoose');
const Schema = mongoose.Schema;

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
        maxlength: 50
    },
    firstname: {
        type: String,
        maxlength: 50
    },
    lastname: {
        type: String,
        maxlength: 50
    },
})

module.exports = mongoose.model('user', userShema);