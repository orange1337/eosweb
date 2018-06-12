const async = require('async');
const config = require('../../config');

let customFunctions = {};

customFunctions.getLastBlocks = (eos, elements, callback) => {
	let resultArr = [];
	eos.getInfo({})
	   	.then(result => { 
	   		if (!result.head_block_num){
	   			return callback('Cant get info from blockchain!');
	   		}
	   		async.each(elements, (elem, cb) => {
	   			eos.getBlock({ block_num_or_id: result.head_block_num - elem })
	   				.then(block => {
	   					resultArr.push(block);
	   					cb();
	   				})
	   				.catch(err => {
	   					console.error('customFunctions getBlock error - ', err);
	   					cb();
	   				});
	   			}, (err) => {
	   				if (err){
	   					return callback(err)
	   				}
	   				resultArr.sort( (a, b) => {
	   					return b.block_num - a.block_num;
	   				});
	   				callback(null, resultArr);
	   			})
	   	})
	   	.catch(err => {
	   		callback(err);
	   	});
};

/*customFunctions.getLastTransactions = (eos, callback) => {
	let resultArr = [];
	let counter = 0;
	eos.getInfo({})
	   	.then(result => { 
	   		if (!result.head_block_num){
	   			return callback('Cant get info from blockchain!');
	   		}
	   		if (resultArr.length === config.offsetElementsOnMainpage){
	   			return callback(null, resultArr);
	   		}
	   		eos.getBlock({ block_num_or_id: result.head_block_num })
	   		   .then(block => {
	   		   	    if (block.transactions && block.transactions.length > 0 && block.transactions.length < config.offsetElementsOnMainpage){
						resultArr.push(block.transactions);
	   		   	    } else if (block.transactions.length > config.offsetElementsOnMainpage){
	   		   	    	block.transactions.slice(1, config.offsetElementsOnMainpage);
	   		   	    }
	   		   		
	   		   })
	   		   .catch(err => {
	   		   		console.error('customFunctions getBlock error - ', err);
	   		   })
	   	})
	   	.catch(err => {
	   		callback(err);
	   	});
}*/

customFunctions.getStatAggregation = (eos, STATS_AGGR) => {
	async.waterfall([
		(cb) => {
			STATS_AGGR.findOne({}, (err, result) => {
				if (err){
					return cb(err);
				}
				if (result){
					return cb(null, result);
				}
				let stat = new STATS_AGGR();
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
			   		let elements = Array.from({length: result.head_block_num - stat.cursor_block}, (v, k) => stat.cursor_block++);

			   		//console.log('====== elements length', elements.length, ' start ', elements[0]);
			   		async.eachLimit(elements, config.limitAsync, (elem, ret) => {
			   			eos.getBlock({ block_num_or_id: elem })
			   				.then(block => {
			   					//console.log('==== block number ', block.block_num);
			   					
			   					if (block.transactions && block.transactions.length > 0){
			   						stat.transactions += block.transactions.length;
			   						block.transactions.forEach( elem => {
			   							 if (elem.trx && elem.trx.transaction && elem.trx.transaction.actions){
												stat.actions += elem.trx.transaction.actions.length;
			   							 }
			   						});
			   					}
			   					stat.cursor_block = block.block_num;
			   					stat.save((err) => {
			   						if (err){
			   							console.log(err);
			   							return ret();
			   						}
			   						ret();
			   					});
			   				})
			   				.catch(err => {
			   					console.error('getStatAggregation getBlock error - ', err);
			   					ret();
			   				});
			   			}, (error) => {
			   				if (error){
			   					return cb(error)
			   				}
			   				cb(null, stat);
			   			});
			   	})
			   	.catch(err => {
			   		cb(err);
			   	});
		}
	], (err, stat) => {
		if (err){
			console.error(err);
		}
		console.log('===== end ', stat);
		setTimeout( () => {
			customFunctions.getStatAggregation(eos, STATS_AGGR);
		}, config.blockUpdateTime);
		
	});
};

module.exports = customFunctions;
