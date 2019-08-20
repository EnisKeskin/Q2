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

global.handleBarsSources = {
  "SH": `<div class="container answer-contet">
  <div class="answer-top">
      <div class="statistics" style="display:flex;">
          <div style="display:flex;" class="statistics-item">
              <span class="statistics-item-label">{{count.[0]}}</span>
              <div class="statistics-item-fill statistics-item-fill-1" style="height: {{percent.[0]}}%"></div>
          </div>
          <div class="statistics-item">
              <span class="statistics-item-label">{{count.[1]}}</span>
              <div class="statistics-item-fill statistics-item-fill-2" style="height: {{percent.[1]}}%;"></div>
          </div>
          <div class="statistics-item">
              <span class="statistics-item-label">{{count.[2]}}</span>
              <div class="statistics-item-fill statistics-item-fill-3" style="height: {{percent.[2]}}%"></div>
          </div>
          <div class="statistics-item">
              <span class="statistics-item-label">{{count.[3]}}</span>
              <div class="statistics-item-fill statistics-item-fill-4" style="height: {{percent.[3]}}%;"></div>
          </div>
      </div>
      <div class="progressbar">
      </div>
  </div>
  <div class="answer-bottom">
      <div class="container answer-bottom-in">
          <div class="row">
              <div class="col-md-6">
                  <button type="button" style="background:{{color.[0]}}" class="answer-1"> {{answer.[0]}}</button>
              </div>
              <div class="col-md-6">
                  <button type="button" style="background:{{color.[1]}}" class="answer-2">{{answer.[1]}}</button>
              </div>
              <div class="col-md-6">
                  <button type="button" style="background:{{color.[2]}}" class="answer-3">{{answer.[2]}}</button>
              </div>
              <div class="col-md-6">
                  <button type="button" style="background:{{color.[3]}}" class="answer-4">{{answer.[3]}}</button>
              </div>
          </div>
      </div>
  </div>
</div>`,
  "SHB": `<div class="capsule">
<div class="score-title">
    <h1 class="h1 h1-score">Scoreboard</h1>
</div>
<div class="container score-content">
    <div class="score-block-1st">
        <span> {{first.name}} </span> <span> {{first.point}} </span>
        <img src="images/user-icon/medal.png" class="img-medal" alt="">
        <div class="block-1st">
        </div>
    </div>
    {{#each results}}
    <div class="score-block">
        <span> {{this.name}} </span> <span> {{this.point}} </span>
    </div>
    {{/each}}
</div>
</div>`,
  "GH": `<div class="container players-content"> 
<div class="players-top"> 
    {{pin}}  
</div> 
    <div class="players-bottom"> 
    {{#each players}} 
    <div>{{this.name}}</div> 
    {{/each}} 
 </div> 
</div> 
<div class="container-fluid players-start"> 
    <div class="players-number"> 
        {{num}} <br> Players 
    </div> 
    <div class="button-start"> 
        <button class="btn-start" type="button" onclick="emit()">Start</button> 
    </div> 
</div>`,
  "QH": `<div class="container answer-contet">
    <div class="answer-top">
        <div class="answer-top-in">
            <div class="answer-image">
            </div>
            <div class="answer-question">
                {{question}}
                <div class="triangle">
                </div>
            </div>
        </div>
        <div class="progressbar">
        </div>
    </div>
    <div class="answer-bottom">
       <div class="container answer-bottom-in">
            <div class="row">
                <div class="col-md-6" class="col-md-6">
                    <button type="submit" class="answer-1" onclick="answer(0)">{{answer1}}</button>
                </div>
                <div class="col-md-6" class="col-md-6">
                    <button type="submit" class="answer-2" onclick="answer(1)">{{answer2}}</button>
                </div>
                <div class="col-md-6">
                    <button type="submit" class="answer-3" onclick="answer(2)">{{answer3}}</button>
                </div>
                <div class="col-md-6">
                    <button type="submit" class="answer-4" onclick="answer(3)">{{answer4}}</button>
                </div>
            </div>
        </div>
    </div>
</div>`
}

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
  // render the error page
  res.status(err.status || 500);
  if (err.status == 404)
    res.redirect('/404');
  else
    res.render('error');
});
module.exports = app;
