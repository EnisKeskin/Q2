const mongoose = require('mongoose');

module.exports = () => {
    mongoose.connect('mongodb+srv://theme:QQdFVckbccRnS6o7@cluster0-cv9fc.gcp.mongodb.net/qq?retryWrites=true&w=majority', { useNewUrlParser: true, useCreateIndex: true, useFindAndModify: false });

    mongoose.connection.on('open', () => {
        console.log('MongDB: Connected');
    });
    mongoose.connection.on('error', (err) => {
        console.log('MongDB: Error ' + err);
    });

    mongoose.Promise = global.Promise;

} 
