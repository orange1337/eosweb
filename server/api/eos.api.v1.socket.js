/*
   Created by eoswebnetbp1
*/

const config          = require('../../config.js');
const async           = require('async');
const customFunctions = require('./eos.api.v1.custom');

const log4js = require('log4js');
log4js.configure(config.logger);
const log    = log4js.getLogger('socket_io');

const updateTimeBlocks = config.blockUpdateTime;

let timeToUpdate        = +new Date() + config.RAM_UPDATE;
let timeToUpdateHistory = +new Date() + config.HISTORY_UPDATE;

module.exports = function(io, eos, mongoMain){

  const STATS_AGGR  = require('../models/api.stats.model')(mongoMain);
  const RAM         = require('../models/ram.price.model')(mongoMain);
  const TRX_ACTIONS = require('../models/trx.actions.history.model')(mongoMain);

  io.usersPool = {};

  let offset = config.offsetElementsOnMainpage;
  let elements = Array.from({ length: offset }, (v, k) => k++);

  function getDataSocket(){
    setTimeout(() => {
      let socketsArr = Object.keys(io.usersPool).map( key => { return io.usersPool[key] });
      if (!socketsArr || !socketsArr.length){
          log.info('No user online');
          return getDataSocket();
      }
      //console.log('=======', socketsArr.length);
      async.parallel({
        info: cb => {
          eos.getInfo({})
             .then(result => {
               cb(null, result);
             })
             .catch(err => {
               log.error(err);
               cb('No result');
             });
        },
        blocks: cb => {
          customFunctions.getLastBlocks(eos, elements, (err, result) => {
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
          if (err){
             log.error(err);
          }
          socketsArr.forEach(socket => {
              socket.emit('get_info', result.info);
              socket.emit('get_last_blocks', result.blocks);
              socket.emit('get_aggregation', result.stat);
              socket.emit('get_ram', result.ram);
          });
          getDataSocket();
      });
    }, updateTimeBlocks);
  }

  io.sockets.on('connection',  (socket) => {
    io.usersPool[socket.id] = socket;
    socket.on('disconnect', () => {
       delete io.usersPool[socket.id];
    });
  //====== connection end   
  }); 

  getDataSocket(); 

}
