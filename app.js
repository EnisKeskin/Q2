const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const exphbs = require('express-handlebars');
const db = require('./helper/db')();
const session = require('express-session');
var socket_io = require('socket.io');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var expressValidator = require('express-validator');
var multer = require('multer');
var upload = multer({ dest: './uploads' });
var flash = require('connect-flash');

const app = express();
const io = socket_io();
app.io = io;

global.point = 100;
global.Rooms = {
};

const indexRouter = require('./routes/index')(io);
const gameRouter = require('./routes/game')(io);
const usersRouter = require('./routes/users');
const quizRouter = require('./routes/quiz');
const answerRouter = require('./routes/answer');
const homeRouter = require('./routes/home');
const discoverRouter = require('./routes/discover');
const error404Router = require('./routes/error404');
const editRouter = require('./routes/edit');



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//Session
app.use(session({
  secret: 'SayMyName',
  saveUninitialized: true,
  resave: true
}))

//Passport
app.use(passport.initialize());
app.use(passport.session());

//Validator
app.use(expressValidator({
  errorFormatter: function (param, msg, value) {
    var namespace = param.split('.')
      , root = namespace.shift()
      , formParam = root;

    while (namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param: formParam,
      msg: msg,
      value: value
    };
  }
}));

//express-message
app.use(flash());
app.use((req, res, next) => {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/game', gameRouter);
app.use('/quiz', quizRouter);
app.use('/answer', answerRouter);
app.use('/home', homeRouter);
app.use('/discover', discoverRouter);
app.use('/404', error404Router);
app.use('/edit', editRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  console.log('\n\nerror:::' + err + '\n\n');
  // render the error page
  res.status(err.status || 500);
  if (err.status == 404)
    res.redirect('/404');
  else
    res.render('error');
});
module.exports = app;
