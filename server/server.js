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
const mongoose      = require("mongoose");
const config      = require('../config');

const EOS     = require('eosjs');
let eosConfig = {
  chainId: null,
  //keyProvider: ['PrivateKeys...'], // WIF string or array of keys..
  httpEndpoint: config.EOS_API,
  /*mockTransactions: () => 'pass', // or 'fail'
  transactionHeaders: (expireInSeconds, callback) => {
    callback(null, headers)
  },*/
  expireInSeconds: 60,
  broadcast: true,
  debug: false, // API and transactions
  sign: true
}
const eos     = EOS(eosConfig);

const log4js = require('log4js');
log4js.configure(config.logger);
const log         = log4js.getLogger('server');
process.setMaxListeners(0);

process.on('uncaughtException', (err) => {
    log.error('======= UncaughtException Main Server : ', err);
});

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
//const jwt = require('jwt-simple');

/*io.use(function(socket, next){
  let payload;
    if (socket.handshake.query.token != 'null'){
      let error = false;
      try {
        payload = jwt.decode(socket.handshake.query.token, config.TOKEN_SECRET);
      } catch (err){
        error = true;
      }
      next();
    } else {
      next(new Error('Not authorized!'));
    }
});*/


require('./api/eos.api.v1.socket')(io, eos, mongoMain);

app.use(function(req,res,next){
  req.io = io;
  next();
});
//========= end of socket io connection




app.use(express.static(path.join(__dirname, '../dist')));

require('./router/main.router')(app, config, request, log);
require(`./api/eos.api.${config.apiV}`)(app, config, request, log, eos, mongoMain);

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../dist/index.html'));
});
// ========== cron tasks
//require('./crons/main.cron')();

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  log.error('=====Page not Found ', err);
  // render the error page
  res.status(err.status || 500).end('Page not Found');
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
