/* Cron tasks for daemons , crate by Rost */

const cron        = require('node-cron');
const exec        = require('child_process').exec;
const path        = require('path');

const config      = require('../../config');

module.exports = function(){
    if (config.PROD){
        
        cron.schedule('*/10 * * * *', function(){
          console.log('running accounts analytics daemon cron');
          startAccountsDaemon();
        });

        startAccountsDaemon();
        startAccountsAnalytics();
    }  
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

function startAccountsAnalytics(){
        console.log('====== running account analytics daemon');
        exec('node ' + path.join(__dirname, '../daemons/accounts.analytics.daemon.js'), function (error, sdtout, stderror){
              if (error) {
                return console.error(error);
              }
              if (stderror) {
                console.error('stderror', stderror);
              }
        
              console.log('sdtout', sdtout);
        });
}

