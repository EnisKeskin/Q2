var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var exphbs  = require('express-handlebars');

var indexRouter       = require('./routes/index');
var usersRouter       = require('./routes/users');
var addQuestionRouter = require('./routes/addquestion');
var addQuizRouter     = require('./routes/addquiz');
var answersRouter     = require('./routes/answer');
var discoverRouter    = require('./routes/discover');
var loginRouter       = require('./routes/login');
var mainRouter        = require('./routes/main');
var playerpoolRouter  = require('./routes/playerpool');
var profileRouter     = require('./routes/profile');
var quizReviewRouter  = require('./routes/quizreview');
var scoreboardRouter  = require('./routes/scoreboard');

var app = express();

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
app.use('/addQuestion', addQuestionRouter);
app.use('/addQuiz', addQuizRouter);
app.use('/answer', answersRouter);
app.use('/discover', discoverRouter);
app.use('/login', loginRouter);
app.use('/main', mainRouter);
app.use('/playerpool', playerpoolRouter);
app.use('/profile', profileRouter);
app.use('/quizreview', quizReviewRouter);
app.use('/scoreboard', scoreboardRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
