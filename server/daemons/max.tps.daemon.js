/*
	max TPS, APS daemons
*/ 
const { eos, SETTINGS_DB, log, logSlack, asyncjs, config } = require('./header.require')('tps');
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
	let stat = await wrapper.toStrong(SETTINGS_DB.findOne({}));
	
	if (!stat){
		stat = new SETTINGS_DB();
		await wrapper.toStrong(stat.save());
	}
	
	let info = await wrapper.toStrong(eos.getInfo({}));
	if (!info.last_irreversible_block_num){
		return log.error('Cant get info from blockchain getStatAggregation!');
	}
	let start = stat.cursor_max_tps;
	let elements = Array.from({length: info.last_irreversible_block_num - start}, (v, k) => start = start + 1);

	await getBlockRecursive(stat, info, elements);

	log.info('===== end getMaxTPS ', stat);
	setTimeout(getMaxTps, config.MAX_TPS_TIME_UPDATE);
};

async function getBlockRecursive(stat, info, elements){
	let blockNumber = elements[0];
	if (elements.length === 0){
		 return await wrapper.toStrong(stat.save());
	}
	let [err, block] = await wrapper.to(eos.getBlock({ block_num_or_id: blockNumber }));
	if (err){
		log.error('getMaxTps error - ', err);
		return await getBlockRecursive(stat, info, elements);
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

		stat.max_tps_block = (stat.max_tps < maxPerSec) ? blockNumber : stat.max_tps_block;
		stat.max_tps = (stat.max_tps < maxPerSec) ? maxPerSec : stat.max_tps;
		
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
	stat.cursor_max_tps = blockNumber;
	elements.shift();
	await getBlockRecursive(stat, block, elements);
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



