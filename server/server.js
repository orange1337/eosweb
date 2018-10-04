/*
  Created by eoswebnetbp1 
*/
require('appmetrics-dash').monitor();
const express       = require('express');
const path          = require('path');
const cookieParser  = require('cookie-parser');
const bodyParser    = require('body-parser');
const fs            = require('fs');
const helmet        = require('helmet');
const compression   = require('compression');
const request       = require('request');
const async			    = require('async');

const config        = require('../config');
const mariaDB       = require('mariasql');

const mongoose      = require("mongoose");
mongoose.set('useCreateIndex', true);

const EOS           = require('eosjs');
global.eos          = EOS(config.eosConfig);

const log4js        = require('log4js');
log4js.configure(config.logger);
const log           = log4js.getLogger('server');

const customSlack   = require('./modules/slack.module');
const logSlack      = customSlack.configure(config.loggerSlack.alerts);

process.on('uncaughtException', (err) => {
    logSlack(`======= UncaughtException Main Server :  ${err}`);
});

process.setMaxListeners(0);

mongoose.Promise = global.Promise;

const mongoMain = mongoose.createConnection(config.MONGO_URI, config.MONGO_OPTIONS,
 (err) => {
    if (err){
      log.error(err);
      process.exit(1);
    }
    log.info('[Connected to Mongo EOS] : 27017');
});

const app  = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(helmet());
app.use(compression());

app.set('view engine', 'html');
app.set('views', 'dist');

// ################### create http node express server
const debug = require('debug')('asd:server');
const http = require('http');
const port = normalizePort(process.env.PORT || '3039');
app.set('port', port);
const server = http.createServer(app);

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);


//========= socket io connection
const io  = require('socket.io').listen(server);
require(`./api/eos.api.${config.apiV}.socket`)(io, mongoMain);

if (config.CRON){
    require('./crons/main.cron')();
}
if (config.telegram.ON){
    require('./daemons/ram.bot.daemon')(mongoMain);
}
if (config.MARIA_DB_ENABLE){
    const MARIA = new mariaDB(config.MARIA_DB);
    require(`./api/eos.api.${config.apiV}.tokens`)(app, log, MARIA);
}

app.use(function(req,res,next){
  req.io = io;
  next();
});
//========= end of socket io connection


app.use(express.static(path.join(__dirname, '../dist')));

require('./router/main.router')(app, config, request, log);
require(`./api/eos.api.${config.apiV}`)(app, config, request, log, mongoMain);

/*app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../dist/index.html'));
});*/

// catch 404 and forward to error handler
app.use((req, res, next) => {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  console.error('===== Page not Found ', err);
  // render the error page
  res.status(err.status || 500).redirect('/notfound');
});

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      log.error(bind + ' requires elevated privileges');
      break;
    case 'EADDRINUSE':
      log.error(bind + ' is already in use');
      break;
    default:
      throw error;
  }
}

function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  debug('Listening on ' + bind);
  log.info('Listening on ' + bind);
}
