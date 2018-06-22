/* Cron tasks for daemons , crate by Rost */

const cron        = require('node-cron');
const exec        = require('child_process').exec;
const path        = require('path');

const config      = require('../../config');

module.exports = function(){
    if (config.PROD){
        
        cron.schedule('*/10 * * * *', () => {
          console.log('====== running daemon analytics account 1');
          startAccountsDaemon();
        });
        
        cron.schedule('*/10 * * * *', () => {
          console.log('running account analytics daemon 2');
          startAccountsAnalytics();
        });

        startAccountsDaemon();
        startAccountsAnalytics();
    }  
}


function startAccountsDaemon(){
        console.log('====== running daemon analytics account == 1');
        exec('node ' + path.join(__dirname, '../daemons/accounts.stat.daemon.js'), (error, sdtout, stderror) => {
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
        console.log('====== running account analytics daemon == 2');
        exec('node ' + path.join(__dirname, '../daemons/accounts.analytics.daemon.js'), (error, sdtout, stderror) => {
              if (error) {
                return console.error(error);
              }
              if (stderror) {
                console.error('stderror', stderror);
              }
              console.log('sdtout', sdtout);
        });
}

