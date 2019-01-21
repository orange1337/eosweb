const asyncjs		= require('async');
const config      	= require('../../config');

const mongoose      = require("mongoose");
mongoose.Promise  	= global.Promise;

const EOS     		= require('eosjs');
config.eosConfig.httpEndpoint = config.CRON_API;
const eos     		= EOS(config.eosConfig);

module.exports = (loggerFileName) => {
	const log4js      = require('log4js');
	log4js.configure(config.logger);
	const log         = log4js.getLogger(loggerFileName);
	
	const customSlack = require('../modules/slack.module');
	const logSlack    = customSlack.configure(config.loggerSlack.alerts);

	process.on('uncaughtException', (err) => {
    	logSlack(`======= UncaughtException ${loggerFileName} saemon : ${err}`);
    	process.exit(1);
	});
	
	const mongoMain = mongoose.createConnection(config.MONGO_URI, config.MONGO_OPTIONS,
	 (err) => {
	    if (err){
	      log.error(err);
	      process.exit(1);
	    }
	    log.info('[Connected to Mongo EOS in TPS daemon]');
	});
	
	const SETTINGS_DB = require('../models/api.stats.model')(mongoMain);

	return {eos, SETTINGS_DB, log, logSlack, asyncjs, config};
};