const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const exphbs = require('express-handlebars');
const db = require('./helper/db')();

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const QuizRouter = require('./routes/quiz');
const playRouter = require('./routes/play');
const answersRouter = require('./routes/answer');
const discoverRouter = require('./routes/discover');
const mainRouter = require('./routes/main');
const playerpoolRouter = require('./routes/playerpool');
const homeRouter = require('./routes/home');
const scoreboardRouter = require('./routes/scoreboard');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/quiz', QuizRouter);
app.use('/answer', answersRouter);
app.use('/discover', discoverRouter);
app.use('/main', mainRouter);
app.use('/playerpool', playerpoolRouter);
app.use('/home', homeRouter);
app.use('/play', playRouter);
app.use('/scoreboard', scoreboardRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
