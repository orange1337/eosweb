/*
   Created by eoswebnetbp1
*/

module.exports 	= function(router, log, MARIA) {

	//============ SQL tokens API
	router.post('/api/v1/get_account_tokens', (req, res) => {
		 let account = req.body.account;
	   	 MARIA.query(`select * from (
        			      select * from EOSIO_CURRENCY_BALANCES where account_name = :account and currency<>'EOS'
        			      order by global_action_seq desc
        			  ) as table1 where global_action_seq IN (select max(global_action_seq) from (
        			  	  select * from EOSIO_CURRENCY_BALANCES where account_name = :account and currency<>'EOS'
       				      order by global_action_seq desc
        			  ) as table2 group by currency)`,
					  { account: account }, 
					  (err, rows) => {
	   	 					if (err){
	   	 						return log.error(err);
	   	 					}
	   	 					res.json(rows);
	   	 });
	});

	let CACHE_TOKENS = [];
	let CACHE_TIME;

	router.get('/api/v1/get_tokens', (req, res) => {
		 let dateNow = +new Date();
		 if (CACHE_TIME && CACHE_TIME > dateNow){
		 	return res.json(CACHE_TOKENS);
		 }
		 CACHE_TIME = dateNow + 3600000; // cahce for hour
	   	 MARIA.query(`select * from (select currency, issuer, count(*) as rate from EOSIO_CURRENCY_BALANCES
			   			where currency<>'EOS'
			   			group by currency
			   			order by rate desc) as table1 where table1.rate>100;`,
					  (err, rows) => {
	   	 					if (err){
	   	 						return log.error(err);
	   	 					}
	   	 					CACHE_TOKENS = rows;
	   	 					res.json(rows);
	   	 });
	});
	//============ end of SQL tokens API

// ============== end of exports 
};
























