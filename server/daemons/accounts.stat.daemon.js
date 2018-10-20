// Accounts analytics for airdrops (public info)
const async			= require('async');
const mongoose      = require('mongoose');
const request 		= require('request');
const config      	= require('../../config');

const EOS     		= require('eosjs');
config.eosConfig.httpEndpoint =  (config.CRON) ? config.CRON_API : config.eosConfig.httpEndpoint;
const eos     		= EOS(config.eosConfig);

const log4js      = require('log4js');
log4js.configure(config.logger);
const log         = log4js.getLogger('accounts_daemon');

const customSlack = require('../modules/slack.module');
const logSlack    = customSlack.configure(config.loggerSlack.alerts);

mongoose.Promise = global.Promise;
const mongoMain  = mongoose.createConnection(config.MONGO_URI, config.MONGO_OPTIONS,
 (err) => {
    if (err){
      log.error(err);
      process.exit(1);
    }
    log.info('[Connected to Mongo EOS in accounts daemon] : 27017');
});

const STATS_ACCOUNT = require('../models/api.accounts.model')(mongoMain);
const SETTINGS 		= require('../models/api.stats.model')(mongoMain);


process.on('uncaughtException', (err) => {
	// rewrite to slack notify
    logSlack(`======= UncaughtException Accounts daemon server : ${err}`);
    process.exit(1);
});

function getAccountAggregation(){
	async.waterfall([
		(cb) => {
			SETTINGS.findOne({}, (err, result) => {
				if (err){
					return cb(err);
				}
				if (result){
					return cb(null, result);
				}
				let stat = new SETTINGS();
				stat.save( (err) => {
					if (err){
						return cb(err);
					}
					cb(null, stat);
				});
			});
		},
		(stat, cb) => {
			getAccounts(stat, cb);
		},
		(stat, cb) => {
			STATS_ACCOUNT.distinct("account_name").count( (err, result) => {
					if (err){
						return cb(err);
					}
					stat.accounts = result;
					stat.save((err) => {
			   				if (err){
			   					return cb(err);
			   				}
			   				cb(null, stat);
			   		});
			});
		}
	], (err, stat) => {
		if (err){
			log.error(err);
			process.exit(1);
		}
		log.info('===== end accounts aggr stat ', stat);
		process.exit(0);
	});
}


function getAccounts(stat, cb){
	let limit = 1000;
	let skip = stat.cursor_accounts;
	request.get(`${config.historyChain}/v1/history/get_accounts?counter=on&skip=${skip}&limit=${limit}`, (error, response, body) => {
			if (error){
				return cb(error);
			}
			if (!body){
				return cb(body);
			}
			let data = JSON.parse(body);
			if (stat.cursor_accounts > data.allEosAccounts){
				stat.cursor_accounts -= limit;
				return cb(null, stat);
			}
			saveAccounts(data, (err, result) => {
					if (err){
						return cb(err);
					}
					skip += limit;
					stat.cursor_accounts = skip;
					console.log('===== skip', skip, 'cursor_accounts', stat.cursor_accounts);
					getAccounts(stat, cb);
			});
	});
}

function saveAccounts (action, callback){
		if (!action || !action.accounts || !action.accounts.length){
			return callback('Wrong data accounts action!!');
		}
		console.log('accounts length', action.accounts.length);
	   	async.each(action.accounts, (action, cb) => {
	   		STATS_ACCOUNT.find({ account_name: action.name }, (err, result) => {
	   			if (err){
	   				log.error(err);
	   				return cb();
	   			}
	   			if (result && result.length){
	   				return cb();
	   			}
	   			let stat_acc = new STATS_ACCOUNT({
	   					account_name: action.name
	   			});
	   			stat_acc.save((err) => {
	   				if (err){
	   					log.error(err);
	   				}
	   				cb();
	   			})
	   		});
	   	}, (err) => {
	   		if (err){
	   			log.error(err);	
	   		}
	   		callback(null);
	   	});
}

getAccountAggregation();





