import createError from "http-errors";
import express from "express";
import path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";
import indexRouter from "./routes/index";
import usersRouter from "./routes/users";
import loginRouter from "./routes/login";
import apiRouter from "./routes/api";
import { apiProxy } from './lib/ApiProxy';
import webpackDevMiddleware from "webpack-dev-middleware";
import webpack from "webpack";

import config from "../webpack.config.js";

const compiler = webpack(config);

const FILENAME = typeof __filename !== 'undefined' ? __filename : (/^ +at (?:file:\/*(?=\/)|)(.*?):\d+:\d+$/m.exec(Error().stack) || '')[1];
const DIRNAME = typeof __dirname !== 'undefined' ? __dirname : FILENAME.replace(/[\/\\][^\/\\]*?$/, '');

let app = express();

// view engine setup
app.set('views', path.join(DIRNAME, '../frontend/views'));
app.set('view engine', 'pug');

app.use(webpackDevMiddleware(compiler, {
  publicPath: config.output.publicPath
}));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use('/public',express.static(path.join(DIRNAME, '../build')));

app.use((req, res, next) => {
  if (req.headers['api'] === 'true') {
    return apiProxy(req, res, next);
  }
  next();
});

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/login', loginRouter);
app.use('/service', apiRouter);

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

export default app;
