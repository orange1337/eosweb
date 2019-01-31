/* Cron tasks for daemons , crate by Rost */

const cron        = require('node-cron');
const fork        = require('child_process').fork;
const path        = require('path');

const configName    = (process.env.CONFIG) ? process.env.CONFIG : 'config';
const config        = require(`../../${configName}`);

let ACCOUNTS_PROCESS = 0;
let ACCOUNTS_STAT_PROCESS = 0;
let GLOBAL_STAT_PROCESS = 0;
let NEW_GLOBAL_STAT_PROCESS = 0;
let PRODUCERS_PROCESS = 0;

module.exports = () => {

        cron.schedule('0 0 0 * * *', () => {
            if (GLOBAL_STAT_PROCESS === 0){
              console.log('running account analytics daemon 2');
              startAccountsAnalytics();
            }
        });

        cron.schedule('0 0 0 * * *', () => {
            if (PRODUCERS_PROCESS === 0){
              console.log('running PRODUCERS PROCESS 2');
              startAccountsAnalytics();
            }
        });
        
        startProducersInfoDaemon();

        if (!config.CUSTOM_GLOBA_STATS){
            startAccountsDaemon();
            startGlobalStatAnalytics();

            cron.schedule('*/10 * * * *', () => {
                if (ACCOUNTS_PROCESS === 0){
                  console.log('====== running daemon analytics account 1');
                  startAccountsDaemon();
                }
            });
            cron.schedule('*/1 * * * *', () => {
               if (ACCOUNTS_STAT_PROCESS === 0){
                  console.log('====== new global stat daemon');
                  startGlobalStatAnalytics();
                }
            });
        }
        
        if (config.TPS_ENABLE){
            startTPSdaemon();
        }
}

function startTPSdaemon(){
        let forkProcess = fork(path.join(__dirname, '../daemons/max.tps.daemon.js'));
        forkProcess.on('close', () => {
              console.log('\x1b[33m%s\x1b[0m', '====== Process TPS close Error');
              startTPSdaemon();
        });
}

function startProducersInfoDaemon(){
        PRODUCERS_PROCESS += 1;
        let forkProcess = fork(path.join(__dirname, '../daemons/producers.daemon.js'));
        forkProcess.on('close', res => {
              console.log('\x1b[36m%s\x1b[0m', '====== Process PRODUCERS daemon end');
              PRODUCERS_PROCESS = 0;
        });
}

function startAccountsDaemon(){
        ACCOUNTS_PROCESS += 1;
        let forkProcess = fork(path.join(__dirname, '../daemons/accounts.daemon.js'));
        forkProcess.on('close', res => {
              console.log('\x1b[36m%s\x1b[0m', '====== Process ACCOUNTS daemon end');
              ACCOUNTS_PROCESS = 0;
        });
}

function startAccountsAnalytics(){
        ACCOUNTS_STAT_PROCESS += 1;
        let forkProcess = fork(path.join(__dirname, '../daemons/accounts.analytics.daemon.js'));
        forkProcess.on('close', res => {
              console.log('\x1b[36m%s\x1b[0m' ,'====== Process ANALYTICS daemon end');
              ACCOUNTS_STAT_PROCESS = 0;
        });
}

function startGlobalStatAnalytics(){
        NEW_GLOBAL_STAT_PROCESS += 1;
        let forkProcess = fork(path.join(__dirname, '../daemons/global.daemon.js'));
        forkProcess.on('close', res => {
              console.log('\x1b[36m%s\x1b[0m', '====== Process NEW GLOBAL STAT daemon end');
              NEW_GLOBAL_STAT_PROCESS = 0;
        });
}
