const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const exphbs = require('express-handlebars');
const db = require('./helper/db')();
const session = require('express-session');
var socket_io = require('socket.io');

const app = express();
const io = socket_io();
app.io = io;

global.point = 1000;
global.Rooms = {
};

const indexRouter = require('./routes/index')(io);
const gameRouter = require('./routes/game')(io);
const usersRouter = require('./routes/users');
const quizRouter = require('./routes/quiz');
const answerRouter = require('./routes/answer');
const homeRouter = require('./routes/home');

const scoreboardRouter = require('./routes/scoreboard');
const playRouter = require('./routes/play');
const discoverRouter = require('./routes/discover');



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 60000 }
}));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/game', gameRouter);
app.use('/quiz', quizRouter);
app.use('/answer', answerRouter);
app.use('/home', homeRouter);

app.use('/scoreboard', scoreboardRouter);
app.use('/play', playRouter);
app.use('/discover', discoverRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  console.log('\n\nerror:::' + err+ '\n\n');
  // render the error page
  res.status(err.status || 500);
  res.render('error');
});
module.exports = app;
