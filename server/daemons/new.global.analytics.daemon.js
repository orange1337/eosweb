// Global stat
const request		= require('request');
const mongoose      = require("mongoose");
const config      	= require('../../config');

const EOS     		= require('eosjs');
config.eosConfig.httpEndpoint =  (config.CRON) ? config.CRON_API : config.eosConfig.httpEndpoint;
const eos     		= EOS(config.eosConfig);

const log4js      = require('log4js');
log4js.configure(config.logger);
const log         = log4js.getLogger('global_stat');

const customSlack = require('../modules/slack.module');
const logSlack    = customSlack.configure(config.loggerSlack.alerts);

mongoose.Promise = global.Promise;
const mongoMain  = mongoose.createConnection(config.MONGO_URI, config.MONGO_OPTIONS,
 (err) => {
    if (err){
      log.error(err);
      process.exit(1);
    }
    log.info('[Connected to Mongo EOS in global stat daemon] : 27017');
});

const SETTINGS 	 = require('../models/api.stats.model')(mongoMain);

process.on('uncaughtException', (err) => {
	// rewrite to slack notify
    logSlack(`======= UncaughtException New Global Analytics : ${err}`);
    process.exit(1);
});

request.get(`${config.historyChain}/v1/history/get_actions_transactions`, (err, response, body) => {
	if (err){
		log.error(err);
		process.exit(1);
	}
	let data;
	try{
		data = JSON.parse(body);
	} catch(err){
		log.error(err);
		process.exit(1);
	}
	SETTINGS.findOneAndUpdate({}, {actions: data.actions, transactions: data.transactions}, (err) => {
		if (err){
			log.error(err);
			process.exit(1);
		}
		log.info('Actions and Transactions successfully saved!');
		process.exit();
	});
});


