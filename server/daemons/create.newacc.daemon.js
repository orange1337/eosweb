// Accounts analytics for airdrops (public info)
const async			= require('async');
const mongoose      = require("mongoose");
const config      	= require('../../config');

const pubkey = 'EOS7G6HAB9HngEhJhDB4xKUWGhLUjv4PUjTwVaKPTAxUwqDpNSMVH';

const EOS     		= require('eosjs');
const eos     		= EOS(config.eosConfig);

const log4js      = require('log4js');
log4js.configure(config.logger);
//const log         = log4js.getLogger('accounts_daemon');
const logSlack    = log4js.getLogger('slack_notify');


process.on('uncaughtException', (err) => {
	// rewrite to slack notify
    logSlack.error('======= UncaughtException Accounts daemon server : ', err);
    process.exit(1);
});


/*eos.transaction(tr => {
  tr.newaccount({
    creator: 'ha2timrqguge',
    name: 'eoswebnetest',
    owner: pubkey,
    active: pubkey
  });

  tr.buyrambytes({
    payer: 'ha2timrqguge',
    receiver: 'eoswebnetest',
    bytes: 8192
  });

  tr.delegatebw({
    from: 'ha2timrqguge',
    receiver: 'eoswebnetest',
    stake_net_quantity: '1.0000 EOS',
    stake_cpu_quantity: '1.0000 EOS',
    transfer: 0
  });
});*/
let daily = {
	pair: "BTC/USD",
	exchange: "Binance",
	realPrice: 6127,
	prediction: 6400,
	timeFcast: '28/06/2017 test time'
};
eos.transfer('ha2timrqguge', 'eoswebnetest', '0.0001 EOS', JSON.stringify(daily), (error, result) => {
		if (error){
			console.error(error);
		}
		console.log(result);
});

















