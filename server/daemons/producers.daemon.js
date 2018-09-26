// Global stat
const async			= require('async');
const mongoose      = require("mongoose");
const config      	= require('../../config');

const EOS     		= require('eosjs');
const eos     		= EOS(config.eosConfig);

const log4js      = require('log4js');
log4js.configure(config.logger);
const log         = log4js.getLogger('producers');

const customSlack = require('../modules/slack.module');
const logSlack    = customSlack.configure(config.loggerSlack.alerts);

mongoose.Promise = global.Promise;
const mongoMain  = mongoose.createConnection(config.MONGO_URI, config.MONGO_OPTIONS,
 (err) => {
    if (err){
      log.error(err);
      process.exit(1);
    }
    log.info('[Connected to Mongo EOS in PRODUCERS daemon] : 27017');
});

const TABLE = require('../models/producers.model')(mongoMain);

process.on('uncaughtException', (err) => {
	// rewrite to slack notify
    logSlack(`======= UncaughtException Accounts daemon server : ${err}`);
    process.exit(1);
});

function updatePrucersInfo(){
		 async.waterfall([
		 	(callback) => {
		 		eos.getProducers({
      				json: true,
      				lower_bound: "string",
      				limit: req.params.offset
				})
	   	 		.then(result => {
	   	 			if (!result || !result.rows){
	   	 				return callback(result)
	   	 			}
	   	 			callback(null);
	   	 		})
	   	 		.catch(err => {
	   	 			callback(err);
	   	 		});
		 	},
		 	(callback) => {
		 		async.each(result.rows, (elem, cb) => {
	   	 				if (!elem.url){
	   	 				  		log.error("Empty url producer -", elem.owner);
	   	 				  		return cb();
	   	 				}
	   	 				let url = (elem.url[elem.url.length - 1] === "/") ?  elem.url + "bp.json" : elem.url + "/bp.json";
	   	 				request.get(url, (error, response, body) => {
	   	 				 		if (error){
	   	 				 			log.error(err);
	   	 				 			return cb();
	   	 				 		}
	   	 				 		saveProducerInfo(body, (err) => {
									if (err){
										log.error(err);
	   	 				 			}
	   	 				 			console.log("Producer updated ", body.producer_account_name);
	   	 				 			cb();
	   	 				 		});
	   	 				});
	   	 			}, () => {
						callback(null);
	   	 			});
		 	}
		 ], (err) => {
		 	if (err){
		 		return logSlack(`======= Producers list empty : ${err}`);
		 	}
		 	log.info("======= Producers list info updated successfully !!!");
		 	process.exit();
		 });
}

function saveProducerInfo(bp, callback){
	if (!bp || !bp.producer_account_name || !bp.org || !bp.org.location || 
		!bp.org.location.country || !bp.org.branding || !bp.org.branding.logo_256){
	 		return callback("Wong bp.json !!!!");
	}
	TABLE.findByIdAndUpdate({ name: bp.producer_account_name }, { name: bp.producer_account_name, 
																  location: bp.org.location.country,
																  image: bp.org.branding.logo_256
							}).exec((err) => {
								if (err){
									return callback(err);
								}
								callback(null);
							});	
}














