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

let timeToUpdate        = +new Date() + config.RAM_UPDATE;
let timeToUpdateHistory = +new Date() + config.HISTORY_UPDATE;

let SOCKET_ROOM = 'pool';
let userCountHandler = 0;

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
      async.parallel({
        info: cb => {
          eos.getInfo({})
             .then(stat => {
                if (!stat.head_block_num){
                    return cb('Cant get info from blockchain!');
                }
                let start = stat.head_block_num - 1;
                let end = stat.head_block_num;
                let TPSliveTx = 0;
                getBlocksInfo(start, end).then(block => {
                    if (block.start && block.end && block.start.transactions && block.end.transactions){
                        TPSliveTx = block.start.transactions.length + block.end.transactions.length;
                    }
                    cb(null, { stat: stat, tps: TPSliveTx });
                }).catch(err => {
                    console.error(err);
                    cb(null, { stat: stat, tps: 0 });
                });
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
          if (err){
             log.error(err);
             logSlack(`socket error - ${err}`);
          } else {
              io.to(SOCKET_ROOM).emit('get_info', result.info.stat);
              io.to(SOCKET_ROOM).emit('get_tps', result.info.tps);
              io.to(SOCKET_ROOM).emit('get_last_blocks', result.blocks);
              io.to(SOCKET_ROOM).emit('get_aggregation', result.stat);
              io.to(SOCKET_ROOM).emit('get_ram', result.ram);
              //io.to(SOCKET_ROOM).emit('users_online', userCountHandler);
              console.log(`===== Users online: ${userCountHandler}`);
          }
          setTimeout(getDataSocket, updateTimeBlocks);
      });
  }

  async function getBlocksInfo(block_start, block_end){
      let startPromise = eos.getBlock({ block_num_or_id: block_start });
      let endPromise   = eos.getBlock({ block_num_or_id: block_end });
      let start = await startPromise;
      let end   = await endPromise;
      return {
         start: start,
         end: end
      }
  }

  io.on('connection', socket => {
    socket.join(SOCKET_ROOM);

    userCountHandler += 1;
    socket.on('disconnect', () => {
      socket.leave(SOCKET_ROOM);
      userCountHandler -= 1;
    });
  });

  getDataSocket(); 

}
