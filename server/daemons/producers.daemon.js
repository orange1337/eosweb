/*
 	Producers daemon info
*/
const { TABLE_DB, log, config, request, req, path, fs, asyncjs } = require('./header')('producers');
const { asyncWrapper, asyncForEach } = require('../utils/main.utils');
const wrapper = new asyncWrapper(log);

const PRODUCERS_LIMITS 	= 500;
const defaultImg 		= '/assets/images/eosio.png';
const bpsImg 			= '/assets/images/bps/';
const bpsImgPath 		= path.join(__dirname, '../../dist/assets/images/bps/');
const sharp 			= require('sharp');

async function updateProducersInfo(){
	let options = {
			uri:`${config.customChain}/v1/chain/get_table_rows`,
			method: 'POST',
			body: {
				json: true,
				code: "eosio",
				scope: "eosio",
				table: "producers",
				limit: PRODUCERS_LIMITS
			},
			json: true
	};
	let data = await wrapper.toStrong(request(options));
	if (!data || !data.rows){
		// logSlack(`======= Producers list empty : ${data}`);
		process.exit(1);
	}

	asyncjs.eachLimit(data.rows, config.limitAsync, (elem, cb) => {
	   	 	if (!elem.url){
	   	 	  		log.error("Empty url producer -", elem.owner);
	   	 	  		return cb();
	   	 	}
	   	 	let url = (elem.url[elem.url.length - 1] === "/") ?  elem.url + `${config.producerJSON}` : elem.url + `/${config.producerJSON}`;
	   	 	if (url.indexOf("http") === -1){
	   	 		url = "http://" + url;
	   	 	}
	   	 	console.log(url);
	   		req.get({url, rejectUnauthorized: false}, (error, response, body) => {
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
		log.info("======= Producers list info updated successfully !!!");
		process.exit();
	});
}

function saveProducerInfo(bp, elem, callback){
	bp.producer_account_name = (bp.producer_account_name && bp.producer_account_name.length) ? bp.producer_account_name : bp.org.candidate_name;
	if (!bp || !bp.producer_account_name || !bp.org || !bp.org.location ||
		!bp.org.location.country || !bp.org.branding || !bp.org.branding.logo_256){
	 		return callback(`Wong ${bp.producer_account_name} ${config.producerJSON} !!!!`);
	}
	let updateObg = {  name: elem.owner, location: bp.org.location.country, image: defaultImg };
	downloadBPImage(bp.org.branding.logo_256, `${bpsImgPath}${elem.owner}`, (err, format) => {
			if (err){
				 console.log('No image for Producer');
			}
			updateObg.image = (format) ? `${bpsImg}${elem.owner}_40${format}` : updateObg.image;
			TABLE_DB.findOne({ name: elem.owner }, (err, result) => {
			 	if (err){
			 		return callback(err);
			 	}
			 	if (!result){
			 		let producer = new TABLE_DB(updateObg);
			 		producer.save((err) => {
			 			if (err){
			 				return callback(err);
			 			}
			 			callback(null);
			 		});
			 	} else {
			 	  TABLE_DB.updateOne({ name: bp.producer_account_name }, updateObg, (err) => {
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
  req.head(uri, (err, res, body) => {
  	if (err || !res.headers){
    	return callback(err);
    }
    let format = `.${res.headers['content-type'].split('/')[1]}`;
    if (format === '.html'){
    	return callback(err);
    }
    let pathToFile = filename + format;
    req(uri).pipe(fs.createWriteStream(pathToFile)).on('close', (err) => {
    		if (err){
    			return callback(err);
    		}
    		sharp(pathToFile).resize(40, 40).toFile(filename + '_40' + format, (err, info) => {
				if (err){
					 console.log(err);
				}
				callback(null, format);
			});
    });
  });
};


updateProducersInfo();













