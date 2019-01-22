/*
	max TPS, APS daemons
*/ 
const { eos, SETTINGS_DB, log, config } = require('./header')('tps');
const { asyncWrapper } = require('../utils/main.utils');
const wrapper = new asyncWrapper(log);

const SECOND = 1000;
let currentTrx = 0,
	previousTrx = 0,
	currentTrxTime = 0,
	previousTrxTime = 0,
	maxPerSec = 0,
	counter = 0;

async function getMaxTps(){
	let settings = await wrapper.toStrong(SETTINGS_DB.findOne({}));
	if (!settings){
		settings = new SETTINGS_DB();
		await wrapper.toStrong(settings.save());
	}
	
	let info = await wrapper.toStrong(eos.getInfo({}));
	if (!info.last_irreversible_block_num){
		return log.error('Cant get info from blockchain!');
	}
	let start = settings.cursor_max_tps;
	let elements = Array.from({length: info.last_irreversible_block_num - start}, (v, k) => start = start + 1);

	await getBlockRecursive(settings, info, elements);

	log.info('===== end getMaxTPS ', settings);
	setTimeout(getMaxTps, config.MAX_TPS_TIME_UPDATE);
};

async function getBlockRecursive(settings, info, elements){
	let blockNumber = elements[0];
	if (elements.length === 0){
		 return await wrapper.toStrong(settings.save());
	}
	let [err, block] = await wrapper.to(eos.getBlock({ block_num_or_id: blockNumber }));
	if (err){
		log.error('getMaxTps error - ', err);
		return await getBlockRecursive(settings, info, elements);
	}

	if (block && block.transactions && block.transactions.length){
	   	maxPerSec += block.transactions.length;
	}
	if (counter === 1){
		console.log(`=== Block ${blockNumber}, Max TPS: ${maxPerSec}`);
		
		currentTrx = getActionsCount(block).trxCounter;
		currentTrxTime = +new Date(block.timestamp);

		if (currentTrxTime - previousTrxTime >= SECOND){
			maxPerSec = currentTrx;
		} else {
			maxPerSec = currentTrx + previousTrx;
		}

		settings.max_tps_block = (settings.max_tps < maxPerSec) ? blockNumber : settings.max_tps_block;
		settings.max_tps = (settings.max_tps < maxPerSec) ? maxPerSec : settings.max_tps;
		
		currentTrx = 0;
		previousTrx = 0;
		currentTrxTime = 0;
		previousTrxTime = 0;
		maxPerSec = 0;
		counter = 0;
	} else {
		counter += 1;
		previousTrx = getActionsCount(block).trxCounter;
		previousTrxTime = +new Date(block.timestamp);
	}			   			
	settings.cursor_max_tps = blockNumber;
	elements.shift();
	await getBlockRecursive(settings, block, elements);
}

function getActionsCount (block){
  let trxCounter = 0;
  if (!block || !block.transactions || block.transactions.length < 1) {
    	return { trxCounter : 0, actionsCounter: 0 };
  }
  let actionsCounter = block.transactions.reduce(
    (result, transaction) => {
    	if (transaction.status !== 'expired'){
    		trxCounter += 1;
    	}
    	return result + ( (transaction.trx.transaction && transaction.trx.transaction.actions) ? transaction.trx.transaction.actions.length : 0)
    }, 0,
  );
  return { actionsCounter, trxCounter };
};

getMaxTps();



