/*
	Accounts stat daemon
*/ 
const { SETTINGS_DB, STATS_ACCOUNT_DB, log, config, request } = require('./header')('accounts_daemon');
const { asyncWrapper, asyncForEach } = require('../utils/main.utils');
const wrapper = new asyncWrapper(log);

async function getAccountAggregation(){
	let settings = await wrapper.toStrong(SETTINGS_DB.findOne({}));
	if (!settings){
		settings = new SETTINGS_DB();
		await wrapper.toStrong(settings.save());
	}

	await getAccounts(settings);

	let accounts = await wrapper.toStrong(STATS_ACCOUNT_DB.estimatedDocumentCount());

	settings.accounts = accounts;
	await wrapper.toStrong(settings.save());
	
	log.info('===== END accounts aggregation', settings);
	process.exit(0);
}


async function getAccounts(settings){
	let limit = 1000;
	let skip  = settings.cursor_accounts;
	let [err, data] = await wrapper.to(request(`${config.historyChain}/v1/history/get_accounts?counter=on&skip=${skip}&limit=${limit}`));
	if (err){
		log.error(err);
		return;
	}
	let accounts;
	try {
		accounts = JSON.parse(data);
	} catch(e){
		console.error(e);
		return;
	}
	if (settings.cursor_accounts > accounts.allEosAccounts){
			settings.cursor_accounts -= limit;
			return;
	}
	await saveAccounts(accounts);
	skip += limit;
	settings.cursor_accounts = skip;
	console.log('===== skip', skip, 'cursor_accounts', settings.cursor_accounts);
	await getAccounts(settings);
}

async function saveAccounts (data){
		if (!data || !data.accounts || !data.accounts.length){
			log.error('Wrong data accounts data!!');
			return;
		}
		console.log('Accounts length', data.accounts.length);
		await asyncForEach(data.accounts, async (elem) => {
				let query = { account_name: elem.name };
			    let [err, accounts] = await wrapper.to(STATS_ACCOUNT_DB.updateOne(query, query, { upsert: true }));
			    if (err){
	   				log.error(err);
	   		    }
		});
}

getAccountAggregation();





