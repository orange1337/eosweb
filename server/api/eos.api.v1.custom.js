/*
   Created by eoswebnetbp1
*/

const async = require('async');
const configName    = (process.env.CONFIG) ? process.env.CONFIG : 'config';
const config        = require(`../../${configName}`);

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

function getBlockOffset(){
	  eos.getBlock({ block_num_or_id: result.head_block_num })
	     .then(block => {
	     	    if (block.transactions && block.transactions.length > 0 && block.transactions.length < config.offsetElementsOnMainpage){
					resultArr.push(block.transactions);
	     	    } else if (block.transactions.length > config.offsetElementsOnMainpage){
	     	    	block.transactions.slice(0, config.offsetElementsOnMainpage);
	     	    }
	     		
	     })
	     .catch(err => {
	     		console.error('customFunctions getBlock error - ', err);
	     });
}

module.exports = customFunctions;
