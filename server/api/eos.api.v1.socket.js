const config          = require('../../config.js');
const async           = require('async');
const customFunctions = require('./eos.api.v1.custom');

const log4js = require('log4js');
log4js.configure(config.logger);
const log    = log4js.getLogger('socket_io');

const updateTime = {
    blocks: 5000
};

module.exports = function(io, eos){
  io.sockets.on('connection',  (socket) => {

    let elements = [];
    let offset = 20;
    for(let i = 0; i <= offset; i++){
        elements.push(i);
    }

    setInterval( () => {
        eos.getInfo({})
            .then(result => {
              socket.emit('get_info', result);
            })
            .catch(err => {
              log.error(err);
            });
        customFunctions.getLastBlocks(eos, elements, (err, result) => {
            if (err){
              log.error(err);
              return res.status(501).end();
            }
            socket.emit('get_last_blocks', result);
        });
    }, updateTime.blocks);

    socket.on('disconnect', () => {
       log.info('disconnect', );
    });
  
  //====== connection end   
  });  
}
