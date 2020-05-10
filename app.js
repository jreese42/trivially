var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const WebSocket = require('ws');

var TriviaGameWebSocketServer = require('./game/webSocketServer.js')

wss = new TriviaGameWebSocketServer()

var sassMiddleware;
if (process.env.NODE_ENV !== 'production') {
    try {
        sassMiddleware = require('node-sass-middleware');
        console.log("Running with node-sass-middleware");
    }
    catch (e) {
        console.log("Running without node-sass-middleware");
    }
} else {
    console.log("Running without node-sass-middleware");
}

var indexRouter = require('./routes/index');
var apiRouter = require('./routes/api');

var app = express();


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

//SASS middleware. Ideally, SASS is precompiled to css, but this is easier for dev.
//See the "compile-sass" build script in package.json
//This version serves css on the fly, compiling it upon request so that changes
//will be reflected without restarting.  The compiled css should be committed to the repo because
//this middleware is automatically disabled when deployed.
if (sassMiddleware) {
  app.use(sassMiddleware({
      src: path.join(__dirname, 'sass'),
      dest: path.join(__dirname, 'public', 'stylesheets'),
      prefix:  '/stylesheets', //a request for public/stylesheets/*.css should route back to sass/*.css
      debug: true
    })
  );
}

app.use(express.static(path.join(__dirname, 'public')));
app.use('/js', express.static(__dirname + '/node_modules/bootstrap/dist/js')); // redirect bootstrap JS
app.use('/js', express.static(__dirname + '/node_modules/popper.js/dist/umd')); // redirect CSS popper
app.use('/js', express.static(__dirname + '/node_modules/jquery/dist')); // redirect JS jQuery
app.use('/css', express.static(__dirname + '/node_modules/animate.css')); // redirect CSS animate.css
app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css')); // redirect CSS bootstrap

app.use('/', indexRouter);
app.use('/api', apiRouter);

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
