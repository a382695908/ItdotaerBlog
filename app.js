var express = require('express');
var session = require('express-session');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

//Config
var config = require('./config');
//View Related Routes
var routes = require('./routes/index');
//Api Related Routes
var api = require('./routes/indexApi');

//Express App
var app = express();

//Middlewares
var errorHandler = require('./middlewares/errorHandler');

//Is Dev Environment?
var isDevEnv = app.get('env') === 'development';

// View Engine Setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// If use favicon
//app.use(favicon(__dirname + '/public/favicon.ico'));

//If Dev, Enable logger
if(isDevEnv){
    app.use(logger('dev'));
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
//Session
app.use(session({
  secret: config.appInfo.sessionSecret
}))
//Public dir
app.use(express.static(path.join(__dirname, 'build')));

//Routes
app.use('/', routes);
app.use('/api', api);

//Not Found
app.use(errorHandler.notFound);

//Dev Error
if (isDevEnv) {
    app.use(errorHandler.serverDevError);
}

//Prod Error
app.use(errorHandler.serverError);

module.exports = app;
