const config          = require('../../config.js');
const async           = require('async');
const customFunctions = require('./eos.api.v1.custom');

const log4js = require('log4js');
log4js.configure(config.logger);
const log    = log4js.getLogger('socket_io');

const updateTime = {
    blocks: config.blockUpdateTime
};

module.exports = function(io, eos, mongoMain){

  const STATS_AGGR = require('../models/api.stats.model')(mongoMain);
  io.usersPool = {};

  let offset = config.offsetElementsOnMainpage;
  let elements = Array.from({ length: offset }, (v, k) => k++);

  let interval = setInterval(() => {
      let socketsArr = Object.keys(io.usersPool).map( key => { return io.usersPool[key] });
      if (!socketsArr || !socketsArr.length){
        return log.info('No user online');
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
                    cb(null, result);
               })
               .catch(err => {
                    log.error(err);
                    cb('No result');
               });
        },
      }, (err, result) => {
          socketsArr.forEach(socket => {
              socket.emit('get_info', result.info);
              socket.emit('get_last_blocks', result.blocks);
              socket.emit('get_aggregation', result.stat);
              socket.emit('get_ram', result.ram);
          });
      });

  }, updateTime.blocks);

  io.sockets.on('connection',  (socket) => {
    io.usersPool[socket.id] = socket;
    socket.on('disconnect', () => {
       delete io.usersPool[socket.id];
    });
  //====== connection end   
  });  

}
