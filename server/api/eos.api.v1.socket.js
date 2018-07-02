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

  io.sockets.on('connection',  (socket) => {

    let offset = config.offsetElementsOnMainpage;
    let elements = Array.from({ length: offset }, (v, k) => k++);

    let interval = setInterval(() => {
        eos.getInfo({})
            .then(result => {
              socket.emit('get_info', result);
            })
            .catch(err => {
              log.error(err);
            });

        customFunctions.getLastBlocks(eos, elements, (err, result) => {
            if (err){
              return log.error(err);
            }
            socket.emit('get_last_blocks', result);
        });

        STATS_AGGR.findOne({}, (err, result) => {
            if (err){
              return log.error(err);
            }
            socket.emit('get_aggregation', result);
        });
    }, updateTime.blocks);

    socket.on('disconnect', () => {
       clearInterval(interval);
    });
  
  //====== connection end   
  });  
}
