const async			= require('async');
const mongoose      = require("mongoose");
const config      	= require('../../config');

const EOS     		= require('eosjs');
const eos     		= EOS(config.eosConfig);

mongoose.Promise = global.Promise;
const mongoMain  = mongoose.createConnection(config.MONGO_URI, config.MONGO_OPTIONS,
 (err) => {
    if (err){
      console.error(err);
      process.exit(1);
    }
    console.log('[Connected to Mongo EOS in accounts daemon] : 27017');
});

const RAM 			= require('../models/ram.price.model')(mongoMain);
const RAM_ORDERS 	= require('../models/ram.orders.model')(mongoMain);

process.on('uncaughtException', (err) => {
	// rewrite to slack notify
    console.error('======= UncaughtException Accounts daemon server : ', err);
    process.exit(1);
});

function getAccountAggregation (){
	async.waterfall([
		(callback) => {
			RAM_ORDERS.find({}, callback);
		},
		(orders, callback) => {
			async.each(orders, (order, cb) => {
				let time = +new Date(order.date);
				RAM.find({ date: { $gte: new Date(time - 10 * 60 * 1000), $lte: new Date(time + 10 * 60 * 1000) } }, (err, result) => {
					if (err){
						console.error(err);
						return cb();
					}
					if (!result[0]){
						console.log(' no quaute');
						return cb();
					}
					let price = result[0].quote.split(' ')[0] / result[0].base.split(' ')[0] * 1024;
					RAM_ORDERS.update({ _id: order._id }, { price: price }, (err) => {
						if (err){
							console.error();
							return cb();
						}
						console.log(order._id, price);
						cb();
					});
					
				});
			}, (err) => {
				if(err){
					return cb(err);
				}
				callback(null);
			});
		},
	], (err) => {
		if (err){
			console.error(err);
			process.exit(1);
		}
		console.log('===== end');
		process.exit(0);
	});
};




getAccountAggregation();




