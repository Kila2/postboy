import errorHandler from 'errorhandler';

import * as DBHelper from './lib/DBHelper';
import { apiProxy } from './lib/ApiProxy';

const express = require('express');
const path = require('path');
// const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

const index = require('./routes/index');
const users = require('./routes/users');
const login = require('./routes/login');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, '../frontend/views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));

// this is an example; you can use any pattern you like.
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use('/public',express.static(path.join(__dirname, '../build')));

app.use((req, res, next) => {
  if(req.headers['api'] === 'true'){
    return apiProxy(req,res,next);
  }
  if (req.url === '/login') {
    return next();
  }
  return (async function findToken() {
    try {
      const rs = await DBHelper.db.collection('User').findOne({ token: req.cookies['postman-like'] });
      if (rs != null) {
        next();
      } else {
        res.render('login');
      }
    } catch (err) {
      next(err);
    }
  }());
});

app.use('/login', login);
app.use('/', index);
app.use('/users', users);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});


if (process.env.NODE_ENV === 'development') {
  app.use(errorHandler());
} else {
  app.use((err, req, res, next) => {
    if (res.headersSent) {
      return next(err);
    }
    if (err != null) {
      res.json({
        rc: 1,
        error: err.message,
      });
    } else {
      next();
    }
  });
}
module.exports = app;
