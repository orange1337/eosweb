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

const decimalEOS = '0.001 EOS';

/*eos.transaction(tr => {
  tr.newaccount({
    creator: 'ha2timrqguge',
    name: 'crypticseos2',
    owner: pubkey,
    active: pubkey
  });

  tr.buyrambytes({
    payer: 'ha2timrqguge',
    receiver: 'crypticseos2',
    bytes: 8192
  });

  tr.delegatebw({
    from: 'ha2timrqguge',
    receiver: 'crypticseos2',
    stake_net_quantity: '0.01 EOS',
    stake_cpu_quantity: '0.01 EOS',
    transfer: 0
  });
});*/

/*eos.transaction(tr => {
  tr.delegatebw({
    from: 'crypticseos1',
    receiver: 'crypticseos2',
    stake_cpu_quantity: '0.1 EOS',
    stake_net_quantity: "0 EOS",
    transfer: 0
  });
});*/

/*eos.transaction(tr => {
  tr.regproducer({
    producer: 'eoswebnetbp1',
    producer_key: 'EOS5sT6mdCkTBLZM8vZnwqmBpA6gjtbdSTEeGL2k26JQFnjaCg6j2',
    url: 'https://eosweb.net/',
    location: 0
  });
});*/

/*eos.transaction(tr => {
  tr.undelegatebw({
    from: 'ha2timrqguge',
    receiver: 'ha2timrqguge',
    unstake_net_quantity: "8 EOS",
    unstake_cpu_quantity: "8 EOS",
    transfer: 0
  });
});*/

/*eos.transaction(tr => {
  tr.voteproducer({
    voter: 'ha2timrqguge',
    proxy: '',
    producers: ['eoswebnetbp1']
  });
});*/

/*eos.transaction(tr => {
  tr.sellram({
    account: 'crypticseos2',
    bytes: 3000,
  });
});*/

/*let daily = {
  dataSet: "JUST FOR TESTING !!!!!!!!",
	pair: "BTC/USD",
	exchange: "Binance",
	realPrice: 6127,
	prediction: 6400,
	timeFcast: new Date(+new Date() - 60 * 60 * 1000)
};*/

/*eos.transfer('crypticseos2', 'ha2timrqguge', '1 EOS', '', (error, result) => {
		if (error){
			console.error(error);
		}
    console.log(result);
});*/










