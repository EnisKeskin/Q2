const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const quizShema = new Schema({
    title: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 100
    },
    description: {
        type: String,
        maxlength: 256
    },
    location: {
        type: String,
        maxlength: 35,
    },
    language: {
        type: String,
        maxlength: 35
    },
    pin: {
        type: Number,
        required: true,
        unique: true,
        minlength: 6,
        maxlength: 7,
    },
    img: {
        type: String
    },

    question: {
        question: {
            type: String,
            required: true,
            minlength: 2,
            maxlength: 100,
        },
        answers: {
            type: String,
            required: true,
            minlength: 1,
            maxlength: 100,
        },
        answer: {
            type: String,
            required: true,
            minlength: 1,
            maxlength: 100,
        },
        time: {
            type: Number,
            default: 20,
            require: true,
        },
        img: {
            type: String
        },
    },
})

module.exports = mongoose.model('quiz', quizShema);