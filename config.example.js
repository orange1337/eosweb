/*
  App configuration example created by eoswebnetbp1 (31.08.18)
*/
const path = require('path');
let config = {};

// production mod
config.PROD = false;

//swagger-stats-lions
config.saveRequestsMetrics = true;

// mongo uri and options
config.MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/EOSweb';
config.MONGO_OPTIONS = {
    socketTimeoutMS: 30000,
    keepAlive: true,
    reconnectTries: 30000,
    useNewUrlParser: true
};

// cron processes (aggregation of main stat - actions, transactions, accounts, analytics)
config.CRON = false;
config.CRON_API = 'http://bp.cryptolions.io';

// anable TPS APS daemon aggregation
config.TPS_ENABLE = true;
config.MAX_TPS_TIME_UPDATE = 5000; // time of break between reload (leave by default)

// enable for private network (daemon for Actions, Accounts)
config.CUSTOM_GLOBA_STATS = false;

// producer json name
config.producerJSON = 'bp.json';

// scatter wallet
config.walletAPI = {
        host: 'nodes.get-scatter.com',
        port: '',
        protocol: 'https',
        chainId: 'aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906'
};

// telegram alert bot
config.telegram = {
  ON: false,
  TOKEN: '',
  TIME_UPDATE: 5000
};

// reserve nodes
config.endpoints = ['https://eos.greymass.com', 'http://bp.cryptolions.io', 'http://eosbp-0.atticlab.net'];

// eosjs
config.eosConfig = {
  chainId: "038f4b0fc8ff18a4f0842a8f0564611f6e96e8535901dd45e43ac8691a1c4dca",
  keyProvider: "",
  httpEndpoint: config.endpoints[0],
  expireInSeconds: 60,
  broadcast: true,
  debug: false,
  sign: true,
  logger: {
    //log: console.log,
    error: console.error
  }
};

// api url for producers list
config.customChain = 'https://nodes.get-scatter.com';

// api url for history
config.historyChain = 'https://eos.greymass.com';

// tokens api
config.tokensAPI = 'http://api.light.xeos.me/api/account/eos/';

config.apiV = 'v1'; // api version
config.RAM_UPDATE = 5 * 60 * 1000; // time for ram update - /api/api.*.socket
config.HISTORY_UPDATE = 5 * 60 * 1000; // time for stats update - /api/api.*.socket 
config.MAX_BUFFER = 500000; // max buffer size for child processes (kb) - /crons
config.blockUpdateTime = 900; // mainpage upades frequency  - /api/api.*.socket in ml sec
config.offsetElementsOnMainpage = 10; // blocks on mainpage
config.limitAsync = 30; // max threads for async.js module  
config.updateTPS = 1000;

// slack notifications
config.loggerSlack = {
      alerts: {
        type: '',
        token: '',
        channel_id: '',
        username: '',
      }
};

module.exports = config;

