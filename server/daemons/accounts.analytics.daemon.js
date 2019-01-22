/*
    Accounts analytics daemon
*/
const { eos, STATS_ACCOUNT_DB, log, config, asyncjs } = require('./header')('accounts_analytics');
const { asyncWrapper, asyncForEach } = require('../utils/main.utils');
const wrapper = new asyncWrapper(log);

const eosToInt = 10000;

async function getAccountsAnalytics (){
	let accounts = await wrapper.toStrong(STATS_ACCOUNT_DB.find({}, "account_name"));
	if (!accounts || !accounts.length){
		log.info('No Accounts in DB!');
		process.exit();
	}
	
	let counter = 0;
	asyncjs.eachLimit(accounts, config.limitAsync, (elem, cb) => {
			eos.getAccount({ account_name: elem.account_name })
				.then(account => {
					findBalanceAndUpdate(account, () => {
						console.log('==== Accounts updated - cursor ', counter++);
						cb();
					});
				})
				.catch(err => {
					console.error('====== getAccountsAnalytics getAccount elem error - ', err);
					cb();
				});
			}, (err) => {
				if (err){
					log.error(err);
					process.exit(1);
				}
				log.info('===== end analytics function ');
				process.exit(0);
	});
};

function findBalanceAndUpdate(account, callback) {
	  if (!account){
		  return callback();
      }
      let accInfo = {
		  staked: 0,
		  unstaked: 0,
		  balance_eos: 0,
		  balance: []
	  };
      if (account && account.voter_info && account.voter_info.staked){
			accInfo.staked = account.voter_info.staked / eosToInt;
      }

 	  eos.getCurrencyBalance({
      			code: 'eosio.token',
      			account: account.account_name
			}).then(balance => {
	   	 		accInfo.balance = Array.isArray(balance) ? balance : [];
	   	 		accInfo.balance.forEach((elem) => {
	   	 			if (elem.indexOf('EOS') !== -1){
	   	 				accInfo.unstaked = !isNaN(Number(elem.split(' ')[0])) ? Number(elem.split(' ')[0]) : 0;
	   	 			}
	   	 		});
	   	 		accInfo.balance_eos = accInfo.unstaked + accInfo.staked;
	   	 		let saveObject = { staked: accInfo.staked,
	   	 						   unstaked: accInfo.unstaked,
	   	 						   balance_eos: accInfo.balance_eos,
	   	 						   balance: accInfo.balance,
	   	 						   ram_usage: account.ram_usage,
	   	 						   ram_quota: account.ram_quota,
	   	 						   created: new Date(account.created) 
	   	 						  };
	   	 		STATS_ACCOUNT_DB.findOneAndUpdate({ account_name: account.account_name }, saveObject, {multi: true})
	   	 				     	.exec((err) => {
	   	 				     		if (err){
	   	 				     			log.error(err);
	   	 				     		}
	   	 				     		callback();
	   	 				     	});
	   	 	}).catch(err => {
	   	 		log.error(err);
	   	 		callback();
	   	 	});
}


getAccountsAnalytics();


