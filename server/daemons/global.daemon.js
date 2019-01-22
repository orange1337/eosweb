/*
  Global stat
*/
const { SETTINGS_DB, log, config, request } = require('./header')('global_stat');

request.get(`${config.historyChain}/v1/history/get_actions_transactions`, (err, response, body) => {
	if (err){
		log.error(err);
		process.exit(1);
	}
	let data;
	try{
		data = JSON.parse(body);
	} catch(err){
		log.error(err);
		process.exit(1);
	}
	SETTINGS_DB.findOneAndUpdate({}, {actions: data.actions, transactions: data.transactions}, (err) => {
		if (err){
			log.error(err);
			process.exit(1);
		}
		log.info('Actions and Transactions successfully saved!');
		process.exit();
	});
});


