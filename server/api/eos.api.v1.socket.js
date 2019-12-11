/*
   Created by eoswebnetbp1
*/

const configName      = (process.env.CONFIG) ? process.env.CONFIG : 'config';
const config          = require(`../../${configName}`);

const async           = require('async');
const customFunctions = require('./eos.api.v1.custom');
const EOS             = require('eosjs');
const request         = require('request');

const { logWrapper } = require('../utils/main.utils');
const log            = new logWrapper('socket_io');

// const customSlack   = require('../modules/slack.module');
// const logSlack      = customSlack.configure(config.loggerSlack.alerts);

const updateTimeBlocks = config.blockUpdateTime;
const updateTPS        = config.updateTPS;

let timeToUpdate        = +new Date() + config.RAM_UPDATE;
let timeToUpdateHistory = +new Date() + config.HISTORY_UPDATE;

let SOCKET_ROOM = 'pool';
let userCountHandler = 0;
let SOCKET_HANGUP_TIME = +new Date();
let changeAPI = 0;

module.exports = (io, mongoMain, metrics) => {

  const STATS_AGGR  = require('../models/api.stats.model')(mongoMain);
  const RAM         = require('../models/ram.price.model')(mongoMain);
  const TRX_ACTIONS = require('../models/trx.actions.history.model')(mongoMain);

  let offset = config.offsetElementsOnMainpage;
  let blocks = Array.from({ length: offset }, (v, k) => k++);

  io.on('connection', socket => {
    socket.join(SOCKET_ROOM);

    userCountHandler += 1;
    metrics.users.set(userCountHandler);

    socket.on('disconnect', () => {
      socket.leave(SOCKET_ROOM);
      userCountHandler -= 1;
      metrics.users.set(userCountHandler);
    });
  });

  function getDataSocket(){
      if (!io || !io.sockets.adapter.rooms[SOCKET_ROOM]){
          log.info('====== No users online');
          return setTimeout(getDataSocket, updateTimeBlocks);;
      }
      let timeRequestStart = +new Date();
      async.parallel({
        info: cb => {
          global.eos.getInfo({})
             .then(stat => {
                cb(null, stat);
             })
             .catch(err => {
               log.error(err);
               cb('No stat');
             });
        },
        blocks: cb => {
          customFunctions.getLastBlocks(global.eos, blocks, (err, result) => {
                      if (err){
                          log.error(err);
                          return cb('No result');
                      }
                      cb(null, result);
          });
        },
        stat: cb => {
          STATS_AGGR.findOne({}, (err, result) => {
              if (err){
                log.error(err);
                return cb('No result');
              }
              cb(null, result);
          });
        }
      }, (err, result) => {
          let date = +new Date();
          if (err){
             console.error('========= ', err);
             // change nodeos API
             //if (date > SOCKET_HANGUP_TIME){
                 changeAPI += 1;
                 changeAPI = (config.endpoints.length === changeAPI) ? 0 : changeAPI;
                 config.eosConfig.httpEndpoint = config.endpoints[changeAPI];
                 global.eos = EOS(config.eosConfig);
                 console.error('\x1b[33m%s\x1b[0m', `Change API to [${config.eosConfig.httpEndpoint}], socket error - ${err}`);
                 //SOCKET_HANGUP_TIME = date + 60000;
              //}
          } else {
              io.to(SOCKET_ROOM).emit('get_info', result.info);
              io.to(SOCKET_ROOM).emit('get_last_blocks', result.blocks);
              io.to(SOCKET_ROOM).emit('get_aggregation', result.stat);
              io.to(SOCKET_ROOM).emit('users_online', userCountHandler);
          }
          setTimeout(getDataSocket, getSleepTime(timeRequestStart));
      });
  }

  function getTPS(){
      let timeRequestStart = +new Date();
      customFunctions.getLastBlocks(eos, [1, 2], (err, result) => {
            if (err){
                console.error(err);
                return setTimeout(getTPS, getSleepTimeTPS(timeRequestStart));
            }
            io.to(SOCKET_ROOM).emit('get_tps_blocks', result);
            setTimeout(getTPS, getSleepTimeTPS(timeRequestStart));
      });
  }

  function getProducersTable(){
      let timeRequestStart = +new Date();
      let formData = {
        json: true,
        code: 'eosio',
        scope: 'eosio',
        table: 'producers',
        limit: 500
      };
      request.post({url:`${config.customChain}/v1/chain/get_table_rows`, json: formData}, (err, response, body) => {
            if (err){
                log.error(err);
                return setTimeout(getProducersTable, getSleepTime(timeRequestStart));
            }
            io.to(SOCKET_ROOM).emit('producers', body);
            setTimeout(getProducersTable, getSleepTime(timeRequestStart));
      });
  }

  /*function getHistory(){
      let timeRequestStart = +new Date();
      if (timeRequestStart < timeToUpdateHistory){
                  return setTimeout(getHistory, getSleepTime(timeRequestStart));
      }
      timeToUpdateHistory = +new Date() + config.HISTORY_UPDATE;
      STATS_AGGR.findOne({}, (err, result) => {
            if (err){
                log.error(err);
                return setTimeout(getHistory, getSleepTime(timeRequestStart));
            }
            if (!result || isNaN(Number(result.transactions)) || isNaN(Number(result.actions))){
                log.error('====== transactions actions history error');
                return setTimeout(getHistory, getSleepTime(timeRequestStart));
            }
            let trxActions = new TRX_ACTIONS({
                  transactions: result.transactions,
                  actions: result.actions
            });
            trxActions.save(err => {
               if (err){
                  log.error(err);
               }
               log.info(trxActions);
               setTimeout(getHistory, getSleepTime(timeRequestStart));
            });
      });
  }*/

  function getRam(){
      let timeRequestStart = +new Date();
      global.eos.getTableRows({
          json: true,
          code: "eosio",
          scope: "eosio",
          table: "rammarket",
          limit: 10
      }).then(result => {
            let dateNow = +new Date();
            if (dateNow < timeToUpdate){
                io.to(SOCKET_ROOM).emit('get_ram', result);
                return setTimeout(getRam, getSleepTime(timeRequestStart));
            }
            timeToUpdate = +new Date() + config.RAM_UPDATE;
            if (!result || !result.rows || !result.rows[0] || !result.rows[0].quote || !result.rows[0].base){
                              log.error('rammarket data error', result);
                              return setTimeout(getRam, getSleepTime(timeRequestStart));
            }
            let data = result.rows[0];
            let quoteBalance  = data.quote.balance;
            let baseBalance   = data.base.balance;
            let ram = new RAM({
                quote: quoteBalance,
                base: baseBalance
            });
            ram.save(err => {
               if (err) {
                 log.error(err);
                 return setTimeout(getRam, getSleepTime(timeRequestStart));
               }
               log.info('ram market price data ========= ', ram);
               io.to(SOCKET_ROOM).emit('get_ram', result);
               setTimeout(getRam, getSleepTime(timeRequestStart));
            });
       })
       .catch(err => {
            log.error(err);
            setTimeout(getRam, getSleepTime(timeRequestStart));
       });
  }

  function getSleepTime(timeRequestStart){
      let date = +new Date();
      let timeForRequest = date - timeRequestStart;
      let sleep = 3000;

      if (updateTimeBlocks - timeForRequest > 0){
          sleep = updateTimeBlocks - timeForRequest;
      } else {
          sleep = 0;
      }
      return sleep;
  }

  function getSleepTimeTPS(timeRequestStart){
      let date = +new Date();
      let timeForRequest = date - timeRequestStart;
      let sleep = 3000;

      if (updateTPS - timeForRequest > 0){
          sleep = updateTPS - timeForRequest;
      } else {
          sleep = 0;
      }
      return sleep;
  }


  getDataSocket();
  getTPS();
  getProducersTable();
  //getHistory();
  getRam();

  // === end function export
}



