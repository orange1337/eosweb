/*
   Created by eoswebnetbp1
*/

const config          = require('../../config.js');
const async           = require('async');
const customFunctions = require('./eos.api.v1.custom');

const log4js = require('log4js');
log4js.configure(config.logger);
const log    = log4js.getLogger('socket_io');

const customSlack   = require('../modules/slack.module');
const logSlack      = customSlack.configure(config.loggerSlack.alerts);

const updateTimeBlocks = config.blockUpdateTime;
const updateTPS        = config.updateTPS;

let timeToUpdate        = +new Date() + config.RAM_UPDATE;
let timeToUpdateHistory = +new Date() + config.HISTORY_UPDATE;

let SOCKET_ROOM = 'pool';
let userCountHandler = 0;
let SOCKET_HANGUP_TIME = +new Date();

module.exports = function(io, eos, mongoMain){

  const STATS_AGGR  = require('../models/api.stats.model')(mongoMain);
  const RAM         = require('../models/ram.price.model')(mongoMain);
  const TRX_ACTIONS = require('../models/trx.actions.history.model')(mongoMain);

  let offset = config.offsetElementsOnMainpage;
  let blocks = Array.from({ length: offset }, (v, k) => k++);

  function getDataSocket(){
      if (!io || !io.sockets.adapter.rooms[SOCKET_ROOM]){
          log.info('====== No users online');
          return setTimeout(getDataSocket, updateTimeBlocks);;
      }
      let timeRequestStart = +new Date(); 
      async.parallel({
        info: cb => {
          eos.getInfo({})
             .then(stat => {
                cb(null, stat);
             })
             .catch(err => {
               log.error(err);
               cb('No stat');
             });
        },
        blocks: cb => {
          customFunctions.getLastBlocks(eos, blocks, (err, result) => {
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
        },
        ram: cb => {
              eos.getTableRows({
                  json: true,
                  code: "eosio",
                  scope: "eosio",
                  table: "rammarket",
                  limit: 10
              })
               .then(result => {
                    let dateNow = +new Date();
                    if (dateNow < timeToUpdate){
                        return cb(null, result);
                    }
                    timeToUpdate = +new Date() + config.RAM_UPDATE;
                    if (!result || !result.rows || !result.rows[0] || !result.rows[0].quote || !result.rows[0].base){
                                      log.error('rammarket data error', result);
                                      return cb(null);
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
                        return cb(err); 
                       }
                       log.info('ram market price data ========= ', ram);
                       cb(null, result);
                    });
               })
               .catch(err => {
                    log.error(err);
                    cb('No result');
               });
        },
        history: cb => {
            let dateNow = +new Date();
            if (dateNow < timeToUpdateHistory){
                        return cb(null);
            }
            timeToUpdateHistory = +new Date() + config.HISTORY_UPDATE;
            STATS_AGGR.findOne({}, (err, result) => {
                  if (err){
                     log.error(err);
                     return cb(null);
                  }
                  if (!result || isNaN(Number(result.transactions)) || isNaN(Number(result.actions))){
                      log.error('====== transactions actions history error');
                      return cb(null);
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
                     cb(null);
                  });
            });
        },
      }, (err, result) => {
          let date = +new Date();
          if (err){
             log.error(err);
             if (date < SOCKET_HANGUP_TIME){
                logSlack(`socket error - ${err}`);
              } else {
                SOCKET_HANGUP_TIME = date + 60000;
              }
          } else {
              io.to(SOCKET_ROOM).emit('get_info', result.info);
              io.to(SOCKET_ROOM).emit('get_last_blocks', result.blocks);
              io.to(SOCKET_ROOM).emit('get_aggregation', result.stat);
              io.to(SOCKET_ROOM).emit('get_ram', result.ram);
              io.to(SOCKET_ROOM).emit('users_online', userCountHandler);
              //console.log(`===== Users online: ${userCountHandler}`);
          }
          let timeForRequest = date - timeRequestStart;
          let sleep = 1000;
          if (updateTimeBlocks - timeForRequest > 0){
              sleep = updateTimeBlocks - timeForRequest;
          } else {
              sleep = 0;
          }
          //console.log("====== sleep", sleep);
          setTimeout(getDataSocket, sleep);
      });
  }

  io.on('connection', socket => {
    socket.join(SOCKET_ROOM);

    userCountHandler += 1;
    socket.on('disconnect', () => {
      socket.leave(SOCKET_ROOM);
      userCountHandler -= 1;
    });
  });

  function getTPS(){
      let timeRequestStart = +new Date(); 
      customFunctions.getLastBlocks(eos, [1, 2], (err, result) => {
            if (err){
                log.error(err);
                return setTimeout(getTPS, updateTPS);
            }
            
            io.to(SOCKET_ROOM).emit('get_tps_blocks', result);

            let date = +new Date();
            let timeForRequest = date - timeRequestStart;
            let sleep = 1000;

            if (updateTPS - timeForRequest > 0){
                sleep = updateTPS - timeForRequest;
            } else {
                sleep = 0;
            }
            setTimeout(getTPS, sleep);
      });
  }


  getDataSocket();
  getTPS();

  // === end function export 
}



