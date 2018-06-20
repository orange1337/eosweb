/* Cron tasks for daemons , crate by Rost */

var cron        = require('node-cron');
var exec        = require('child_process').exec;
var path        = require('path');

module.exports = function(){
    cron.schedule('*/59 * * * *', function(){
      console.log('running accounts analytics daemon cron');
      startAccountsDaemon();
    });

    startAccountsDaemon();
}


function startAccountsDaemon(){
        console.log('====== running daemon analytics account');
        exec('node ' + path.join(__dirname, '../daemons/accounts.stat.daemon.js'), function (error, sdtout, stderror){
              if (error) {
                return console.error(error);
              }
              if (stderror) {
                console.error('stderror', stderror);
              }
        
              console.log('sdtout', sdtout);
        });
}


