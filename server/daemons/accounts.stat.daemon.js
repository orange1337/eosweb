// Accounts analytics for airdrops (public info)
const async			= require('async');
const mongoose      = require("mongoose");
const config      	= require('../../config');

const EOS     		= require('eosjs');
const eos     		= EOS(config.eosConfig);

const log4js      = require('log4js');
log4js.configure(config.logger);
const log         = log4js.getLogger('accounts_daemon');
const logSlack    = log4js.getLogger('slack_notify');

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
const RAM 			= require('../models/ram.price.model')(mongoMain);

process.on('uncaughtException', (err) => {
	// rewrite to slack notify
    logSlack.error('======= UncaughtException Accounts daemon server : ', err);
    process.exit(1);
});

function getAccountAggregation (){
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
			   			return cb('Cant get info from blockchain getAccountAggregation!');
			   		}
			   		let elements = Array.from({length: result.head_block_num - stat.cursor_accounts}, (v, k) => stat.cursor_accounts++);
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
			   				transactionsAggregate(block.transactions, stat, () => {
			   					stat.cursor_accounts = block.block_num;
			   					log.info(`======== SAVED accoounts, block ${block.block_num}`);
			   					ret();
			   				});
			   			} else {
			   				stat.cursor_accounts = block.block_num;
			   				ret();
			   			}
			   		})
			   		.catch(err => {
			   			log.error('getStatAggregation getBlock elem error - ', err);
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
		},
		(stat, cb) => {
			eos.getTableRows({
			     json: true,
			     code: "eosio",
			     scope: "eosio",
			     table: "rammarket",
			     limit: 10
			})
	   		.then(result => {
	   			  if (!result || !result.rows || !result.rows[0] || !result.rows[0].quote || !result.rows[0].base){
                              log.error('data error', result);
                              return cb(null);
                  }
                  let data = result.rows[0];
        	      let quoteBalance  = data.quote.balance;
        	      let baseBalance   = data.base.balance;
	   			  let ram = new RAM({
	   			  		quote: quoteBalance,
	   			  		base: baseBalance
	   			  });
	   			  ram.save(err => {
	   			  	 if (err) {
	   			  	 	return cb(err);	
	   			  	 }
	   			  	 log.info('ram market price data ========= ', ram);
	   			  	 cb(null, stat);
	   			  });
	   		})
	   		.catch(err => {
	   			cb(err);
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
};


function transactionsAggregate (trx, stat, callback){
	async.each(trx, (elem, cbTx) => {
		if (!elem.trx || !elem.trx.transaction || !elem.trx.transaction.actions){
			log.error('elem.trx.transaction.actions - error', elem);
			return cbTx();
		}
	   	async.each(elem.trx.transaction.actions, (action, cbAction) => {
	   		STATS_ACCOUNT.find({ account_name: action.data.name }, (err, result) => {
	   			if (err){
	   				log.error(err);
	   				return cbAction();
	   			}
	   			if (result && result.length){
	   				return cbAction();
	   			}
	   			let stat_acc = new STATS_ACCOUNT({
	   					account_name: action.data.name
	   			});
	   			stat_acc.save((err) => {
	   				if (err){
	   					log.error(err);
	   				}
	   				cbAction();
	   			})
	   		});
	   	}, (err) => {
	   		if (err){
	   			log.error(err);	
	   		}
	   		cbTx();
	   	});
	}, (error) => {
		if (error){
			log.error(error);
		}
		callback();
	});
}

getAccountAggregation();




