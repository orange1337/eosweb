/* Cron tasks for daemons , crate by Rost */

const cron        = require('node-cron');
const exec        = require('child_process').exec;
const path        = require('path');

const config      = require('../../config');

module.exports = function(){
        
        cron.schedule('*/10 * * * *', () => {
            console.log('====== running daemon analytics account 1');
            startAccountsDaemon();
        });
        
        cron.schedule('*/1 * * * *', () => {
            console.log('====== global stat daemon');
            startGlobalStatAnalytics();
        });

        cron.schedule('0 0 0 * * *', () => {
            console.log('running account analytics daemon 2');
            startAccountsAnalytics();
        });

        startAccountsDaemon();
        startGlobalStatAnalytics();
        //startAccountsAnalytics();
}


function startAccountsDaemon(){
        console.log('====== running daemon analytics account - search in blocks == 1');
        exec('node ' + path.join(__dirname, '../daemons/accounts.stat.daemon.js'), { maxBuffer: 1024 * config.MAX_BUFFER }, (error, sdtout, stderror) => {
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
        console.log('====== running account analytics daemon - balances and other info  == 2');
        exec('node ' + path.join(__dirname, '../daemons/accounts.analytics.daemon.js'), { maxBuffer: 1024 * config.MAX_BUFFER }, (error, sdtout, stderror) => {
              if (error) {
                return console.error(error);
              }
              if (stderror) {
                console.error('stderror', stderror);
              }
              console.log('sdtout', sdtout);
        });
}


function startGlobalStatAnalytics(){
        console.log('====== running global stat analytics daemon - count trx actions  == 3');
        exec('node ' + path.join(__dirname, '../daemons/global.analytics.daemon.js'), { maxBuffer: 1024 * config.MAX_BUFFER }, (error, sdtout, stderror) => {
              if (error) {
                return console.error(error);
              }
              if (stderror) {
                console.error('stderror', stderror);
              }
              console.log('sdtout', sdtout);
        });
}
