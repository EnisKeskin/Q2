const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const quizSchema = new Schema({
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
    userId: {
        type: Schema.Types.ObjectId,
        require: true,
    },
    visibleTo:{
        type: Boolean,
        require: true,
    },
    visibility:{
        type: String
    },
    question: [{
        questionTitle: {
            type: String,
            required: true,
            minlength: 2,
            maxlength: 100,
        },
        answers: {
            type: Array,
            required: true,
            minlength: 1,
            maxlength: 100,
        },
        answer: {
            type: Number,
            required: true,
        },
        time: {
            type: Number,
            default: 20,
            require: true,
        },
        img: {
            type: String
        },
    },],
    active: {
        type: Boolean,
        default: false
    },
    date: {
        type: Date, default: Date.now    
    }
})


module.exports = mongoose.model('quiz', quizSchema);