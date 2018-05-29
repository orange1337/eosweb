const async = require('async');

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
}

module.exports = customFunctions;