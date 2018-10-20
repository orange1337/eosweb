// TPS damon by eoswebnetbp1
const async			= require('async');
const mongoose      = require("mongoose");
const config      	= require('../../config');

const EOS     		= require('eosjs');
config.eosConfig.httpEndpoint = config.CRON_API;
const eos     		= EOS(config.eosConfig);

const log4js      = require('log4js');
log4js.configure(config.logger);
const log         = log4js.getLogger('tps');

const customSlack = require('../modules/slack.module');
const logSlack    = customSlack.configure(config.loggerSlack.alerts);

const customApi	  = require('../api/eos.api.v1.custom');

mongoose.Promise  = global.Promise;
const mongoMain   = mongoose.createConnection(config.MONGO_URI, config.MONGO_OPTIONS,
 (err) => {
    if (err){
      log.error(err);
      process.exit(1);
    }
    log.info('[Connected to Mongo EOS in TPS daemon] : 27017');
});

const SETTINGS = require('../models/api.stats.model')(mongoMain);


process.on('uncaughtException', (err) => {
	// rewrite to slack notify
    logSlack(`======= UncaughtException getTPS saemon : ${err}`);
    process.exit(1);
});


let maxPerSec = 0;
let counter   = 0;

function getMaxTps(){
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
			eos.getInfo({})
			   	.then(result => { 
			   		if (!result.last_irreversible_block_num){
			   			return cb('Cant get info from blockchain getStatAggregation!');
			   		}
			   		let start = stat.cursor_max_tps;
			   		let elements = Array.from({length: result.last_irreversible_block_num - start}, (v, k) => start = start + 1);
			   		cb(null, stat, result, elements);
			   	})
			   	.catch(err => {
			   		cb(err);
			   	});
		},
		(stat, result, elements, cb) => {
			   	getBlockRecursive(stat, result, elements, cb);
		}
	], (err, stat) => {
		if (err){
			log.error(err);
		}
		log.info('===== end getMaxTPS ', stat);
		setTimeout(getMaxTps, config.MAX_TPS_TIME_UPDATE);
	});
};

function getBlockRecursive(stat, result, elements, cb){
	if (elements.length === 0){
		 stat.save((err) => {
			   if (err){
			   		return cb(err);
			   }
			   cb(null, stat);
		 });
	} else {
		eos.getBlock({ block_num_or_id: elements[0] })
		    .then(block => {
			  	if (block.transactions && block.transactions.length){
	   				maxPerSec += block.transactions.length;
	   			}
			  	if (counter === 1){
					console.log(`=== Block ${elements[0]}, Max TPS: ${maxPerSec}`);
					stat.max_tps = (stat.max_tps < maxPerSec) ? maxPerSec : stat.max_tps;
					stat.max_tps_block = (stat.max_tps < maxPerSec) ? block.block_num : stat.max_tps_block;
					maxPerSec = 0;
					counter = 0;
				} else {
					counter += 1;
				}			   			
			  	stat.cursor_max_tps = block.block_num;
			  	elements.shift();
			  	getBlockRecursive(stat, result, elements, cb);
			})
			.catch(err => {
				log.error('getMaxTps error - ', err);
				getBlockRecursive(stat, result, elements, cb);
			});
	}
}


getMaxTps();

