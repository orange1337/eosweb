// Producers info
const async			= require('async');
const mongoose      = require("mongoose");
const request 		= require("request");
const path 			= require("path");
const fs 			= require("fs");
const config      	= require('../../config');

const log4js      = require('log4js');
log4js.configure(config.logger);
const log         = log4js.getLogger('producers');

const customSlack = require('../modules/slack.module');
const logSlack    = customSlack.configure(config.loggerSlack.alerts);

const PRODUCERS_LIMITS = 500;

const defaultImg = '/assets/images/eosio.png';
const bpsImg = '/assets/images/bps/';
const bpsImgPath = path.join(__dirname, '../../src/assets/images/bps/');

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
    logSlack(`======= UncaughtException Producers daemon : ${err}`);
    process.exit(1);
});

function updateProducersInfo(){
		 async.waterfall([
		 	(callback) => {
	   			let formData = { json: true,
					      code: "eosio",
					      scope: "eosio",
					      table: "producers",
					      limit: PRODUCERS_LIMITS
				};
	   			request.post({url:`${config.customChain}/v1/chain/get_table_rows`, json: formData}, (error, response, body) => {
	   					if (error){
	   						console.error(error);
	   	 				 	return callback(error);
	   					}
    					callback(null, body);
	   			});	
		 	},
		 	(result, callback) => {
		 		async.eachLimit(result.rows, config.limitAsync, (elem, cb) => {
	   	 				if (!elem.url){
	   	 				  		log.error("Empty url producer -", elem.owner);
	   	 				  		return cb();
	   	 				}
	   	 				let url = (elem.url[elem.url.length - 1] === "/") ?  elem.url + "bp.json" : elem.url + "/bp.json";
	   	 				if (url.indexOf("http") === -1){
	   	 					url = "http://" + url;
	   	 				}
	   	 				console.log(url);
	   	 				request.get(url, (error, response, body) => {
	   	 				 		if (error){
	   	 				 			console.error(error);
	   	 				 			return cb();
	   	 				 		}
	   	 				 		let data;
								try {
    							    data = JSON.parse(body);
    							} catch (e) {
    								//console.log('Parse json', e);
    							    return cb();
    							}
	   	 				 		saveProducerInfo(data, elem, (err) => {
									if (err){
										log.error(err);
	   	 				 			}
	   	 				 			console.log("Producer updated successfully !!!", data.producer_account_name);
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

function saveProducerInfo(bp, elem, callback){
	if (!bp || !bp.producer_account_name || !bp.org || !bp.org.location || 
		!bp.org.location.country || !bp.org.branding || !bp.org.branding.logo_256){
	 		return callback("Wong bp.json !!!!");
	}
	let updateObg = {  name: bp.producer_account_name, location: bp.org.location.country, image: defaultImg };
	downloadBPImage(bp.org.branding.logo_256, `${bpsImgPath}${elem.owner}`, (err, format) => {
			if (err){
				 console.log('No image for Producer');
			}
			updateObg.image = (format) ? `${bpsImg}${elem.owner}${format}` : updateObg.image;
			TABLE.findOne({ name: bp.producer_account_name }, (err, result) => {
			 	if (err){
			 		return callback(err);
			 	}
			 	if (!result){
			 		let producer = new TABLE(updateObg);
			 		producer.save((err) => {
			 			if (err){
			 				return callback(err); 
			 			}
			 			callback(null);
			 		});
			 	} else {
			 	  TABLE.update({ name: bp.producer_account_name }, updateObg, (err) => {
			 	  		if (err){
			 				return callback(err); 
			 			}
			 			callback(null);
			 	  });
			 	}
			 });
	});
}

function downloadBPImage(uri, filename, callback){
  request.head(uri, (err, res, body) => {
  	if (err || !res.headers){
    	return callback(err);
    }
    let format = `.${res.headers['content-type'].split('/')[1]}`;
    if (format === '.html'){
    	return callback(err);
    }
    request(uri).pipe(fs.createWriteStream(filename + format)).on('close', (err) => {
    		if (err){
    			return callback(err);
    		}
    		callback(null, format);
    });
  });
};


updateProducersInfo();













