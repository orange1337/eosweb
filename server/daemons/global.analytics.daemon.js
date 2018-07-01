// Global stat
const async			= require('async');
const mongoose      = require("mongoose");
const config      	= require('../../config');

const EOS     		= require('eosjs');
const eos     		= EOS(config.eosConfig);

const log4js      = require('log4js');
log4js.configure(config.logger);
const log         = log4js.getLogger('global_stat');
const logSlack    = log4js.getLogger('slack_notify');

mongoose.Promise = global.Promise;
const mongoMain  = mongoose.createConnection(config.MONGO_URI, config.MONGO_OPTIONS,
 (err) => {
    if (err){
      log.error(err);
      process.exit(1);
    }
    log.info('[Connected to Mongo EOS in global stat daemon] : 27017');
});

const SETTINGS 		= require('../models/api.stats.model')(mongoMain);


process.on('uncaughtException', (err) => {
	// rewrite to slack notify
    logSlack.error('======= UncaughtException Global stat daemon server : ', err);
    process.exit(1);
});

function getStatAggregation (){
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
			   		if (!result.head_block_num){
			   			return cb('Cant get info from blockchain getStatAggregation!');
			   		}
			   		let start = stat.cursor_block;
			   		let elements = Array.from({length: result.head_block_num - start}, (v, k) => start = start + 1);
			   		cb(null, stat, result, elements);
			   	})
			   	.catch(err => {
			   		cb(err);
			   	});
		},
		(stat, result, elements, cb) => {
			async.eachLimit(elements, config.limitAsync, (elem, ret) => {
			   	eos.getBlock({ block_num_or_id: elem })
			   		.then(block => {			   			
			   			if (block.transactions && block.transactions.length > 0){
			   				stat.transactions += block.transactions.length;
			   				block.transactions.forEach( elem => {
			   					 if (elem.trx && elem.trx.transaction && elem.trx.transaction.actions){
										stat.actions += elem.trx.transaction.actions.length;
			   					 }
			   				});
			   			}
			   			stat.cursor_block = block.block_num;
			   			log.info("Saved global stat block ==== ", stat.cursor_block);
			   			ret();
			   		})
			   		.catch(err => {
			   			log.error('getStatAggregation getBlock error - ', err);
			   			ret();
			   		});
			   	}, (error) => {
			   		if (error){
			   			return cb(error)
			   		}
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
		}
		log.info('===== end stat aggregation ', stat);
		setTimeout( () => {
			getStatAggregation();
		}, config.blockUpdateTime);
		
	});
};

getStatAggregation()


