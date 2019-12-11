/*
  Created by eoswebnetbp1
*/
//require('appmetrics-dash').monitor();
const express       = require('express');
const path          = require('path');
const cookieParser  = require('cookie-parser');
const bodyParser    = require('body-parser');
const fs            = require('fs');
const helmet        = require('helmet');
const compression   = require('compression');
const request       = require('request');
const async			    = require('async');

const Sentry = require('@sentry/node');
Sentry.init({
  dsn: 'https://88caaa7f26a24288a3db3f9b6b69d12a@sentry.io/1853380',
  environment: process.env.ENVIRONMENT || 'local',
});

const configName    = (process.env.CONFIG) ? process.env.CONFIG : 'config';
const config        = require(`../${configName}`);

const mongoose      = require("mongoose");
mongoose.set('useCreateIndex', true);

const EOS           = require('eosjs');
global.eos          = EOS(config.eosConfig);

const { logWrapper } = require('./utils/main.utils');
const log            = new logWrapper('server');

// const customSlack   = require('./modules/slack.module');
// const logSlack      = customSlack.configure(config.loggerSlack.alerts);
// process.on('uncaughtException', (err) => {
//     logSlack(`======= UncaughtException Main Server :  ${err}`);
// });

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
mongoose.set('useCreateIndex', true);

/**
 * PM2 Metrics
 */
const pm2 = require('@pm2/io');
let metrics = {
   users: pm2.metric({name: 'realtimeUsers'})
};

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
require(`./api/eos.api.${config.apiV}.socket`)(io, mongoMain, metrics);

if (config.CRON){
    require('./daemons/init')();
}
if (config.telegram.ON){
    require('./daemons/ram.bot.daemon')(mongoMain);
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
  //console.log('Url not found', req.url);
  //console.error('===== Page not Found ', err);
  // render the error page
  res.status(err.status || 500).end();
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
