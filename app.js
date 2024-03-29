const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const exphbs = require('express-handlebars');
const db = require('./helper/db')();
const cors = require('cors');
const config = require('./config');
const verifyToken = require('./middleware/verify-token');
const indexRouter = require('./routes/index');
const busboy = require('express-busboy');

const app = express();

busboy.extend(app, {
  upload: true,
  path: './media',
  allowedPath: /./,
  mimeTypeLimit: [
    'image/jpeg',
    'image/png',
    'image/jpg',
    'image/gif',
  ]
})

app.use(cors({ origin: '*' }));
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

app.set('api_top_secret_key', config.api_top_secret_key)
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/media', express.static(path.join(__dirname, 'media')));



app.use('/', indexRouter);
app.use('/api', indexRouter);
app.use('/api/profil', verifyToken);

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
});

module.exports = app;
