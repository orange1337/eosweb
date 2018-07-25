/*
* Created by Rost
*/

const async = require('async');
const path = require('path');
const customFunctions = require('./eos.api.v1.custom');

module.exports 	= function(router, config, request, log, eos, mongoMain, MARIA) {

	const STATS_AGGR 	= require('../models/api.stats.model')(mongoMain);
	const STATS_ACCOUNT = require('../models/api.accounts.model')(mongoMain);
	const RAM 			= require('../models/ram.price.model')(mongoMain);
	const RAM_ORDERS 	= require('../models/ram.orders.model')(mongoMain);
	const TRX_ACTIONS = require('../models/trx.actions.history.model')(mongoMain);

	// ======== aggragation stat
    /*if (config.PROD){
        customFunctions.getStatAggregation(eos, STATS_AGGR);
    }*/

    // ======== end of aggragation stat

    //============ HISTORY API
    /*
	* router - search global aggregation
	*/
	router.post('/api/v1/search', (req, res) => {
		let text = req.body.text;
		if (!text){
			return res.status(501).send('Wrong search input!');
		}

		async.parallel({
			block: (cb) =>{
        		eos.getBlock({ block_num_or_id: text })
	   			 	.then(result => {
	   			 		cb(null, result);
	   			 	})
	   			 	.catch(err => {
	   			 		log.error(err);
	   			 		cb(null, null);
	   			 	});
			},
			transaction: (cb) =>{
				eos.getTransaction({ id: text })
	   			 	.then(result => {
	   			 		cb(null, result);
	   			 	})
	   			 	.catch(err => {
	   			 		cb(null, null);
	   			 	});
			},
			account: (cb) =>{
				eos.getAccount({ account_name: text })
	   			 	.then(result => {
	   			 		cb(null, result);
	   			 	})
	   			 	.catch(err => {
	   			 		cb(null, null);
	   			 	});
			},
			key: (cb) => {
				eos.getKeyAccounts({ public_key: text })
	   	 			.then(result => {
	   	 				cb(null, result);
	   	 			})
	   	 			.catch(err => {
	   	 				cb(null, null);
	   	 			});
			},
			contract: (cb) =>{
				eos.getCode({ json: true, account_name: text })
	   	 			.then(result => {
	   	 				cb(null, result)
	   	 			})
	   	 			.catch(err => {
	   	 				cb(null, null);
	   	 			});
			}
		}, (err, result) => {
			if (!text){
				log.error(err);
				return res.status(501).end();
			}
			res.json(result);
		});
	});

	router.get('/api/v1/get_wallet_api', (req, res) => {
		res.json({ host: config.walletAPI.host, port: config.walletAPI.port, protocol: config.walletAPI.protocol });
	});
	

	/*
	* router - ram_order
	* params - offset
	*/
	router.post('/api/v1/ram_order', (req, res) => {
		 let type 		= req.body.type;
		 let tx_id 		= req.body.tx_id;
		 let account 	= req.body.account;
		 let amount 	= req.body.amount;
		 let price 		= req.body.price;

		 let order = new RAM_ORDERS({
		 		type: type,
		 		tx_id: tx_id,
		 		account: account,
		 		amount: amount,
		 		price: price
		 });

		 order.save(err => {
		 	if (err){
		 		log.error(err);
		 		return res.status(500).end();
		 	}
		 	res.json({ message: 'order successfully saved' });
		 });
	});

	/*
	* router - get_analytics
	* params - offset
	*/
	router.post('/api/v1/get_trx_actions', (req, res) => {
		 TRX_ACTIONS.aggregate()
		 			.match({ date: { $gte : new Date(req.body.date) } })
		 			.sort({ date: 1 })
		 			.group({
		 				_id: {
            					year: { $year: "$date" },
            					dayOfMonth: { $dayOfMonth: "$date" },
            					month: { $month: "$date" },
        				},
        				transactions: { "$push": "$transactions" },
        				actions: { "$push": "$actions" }
		 			})
		 			.exec((err, result) => {
		 				if (err){
		 					log.error(err);
		 					return res.status(500).end();
		 				}
		 				res.json(result);
		 			});
	});
	/*
	* router - ram_orders
	* params - offset
	*/
	router.get('/api/v1/ram_orders/:account', (req, res) => {
		RAM_ORDERS.find({ account: req.params.account })
		  .sort({ date: -1 })
		  .exec((err, result) => {
		 	if (err){
		 		log.error(err);
		 		return res.status(500).end();
		 	}
		 	res.json(result);
		 });
	});

	/*
	* router - get_accounts_analytics
	* params - offset
	*/
	router.get('/api/v1/get_accounts_analytics/:offset', (req, res) => {
		 STATS_ACCOUNT.find()
	   	 		.sort({ balance_eos: -1 })
	   	 		.limit(Number(req.params.offset))
	   	 		.exec((err, result) => {
	   	 		if (err){
	   	 			log.error(err);
	   	 			return res.status(500).end();
	   	 		}
	   	 		res.json(result);
	   	 });
	});

	/*
	* router - get_chart_ram
	* params - offset
	*/
	router.post('/api/v1/get_chart_ram', (req, res) => {
		let query = (req.body.from === 'All') ? {} : { date : { $gte: new Date(req.body.from) } };
	   	 RAM.find(query)
	   	 		.exec((err, result) => {
	   	 		if (err){
	   	 			log.error(err);
	   	 			return res.status(500).end();
	   	 		}
	   	 		res.json(result);
	   	 });
	});

	/*
	* router - get_block
	* params - block_num_or_id
	*/
	router.get('/api/v1/get_block/:block_num_or_id', (req, res) => {
	   	 eos.getBlock({ block_num_or_id: req.params.block_num_or_id })
	   	 	.then(result => {
	   	 		res.json(result);
	   	 	})
	   	 	.catch(err => {
	   	 		log.error(err);
	   	 		res.status(501).end();
	   	 	});
	});

    /*
	* router - get_last_blocks
	* params - offset (number of last blocks you want to get)
	*/
	router.get('/api/v1/get_last_blocks/:offset', (req, res) => {
		let elements = [];
		let offset = req.params.offset;
		for(let i = 0; i <= offset; i++){
			elements.push(i);
		}
		customFunctions.getLastBlocks(eos, elements, (err, result) => {
				if (err){
					log.error(err);
					return res.status(501).end();
				}
				res.json(result);
		});
	});

    /*
	* router - get_aggregation_stat
	*/
	router.get('/api/v1/get_aggregation_stat', (req, res) => {
		STATS_AGGR.findOne({}, (err, result) => {
			if (err){
				log.error(err);
				return res.status(501).end();
			}
			res.json(result);
		});
	});

    /*
	* router - get blocks producers
	*/
	router.get('/api/v1/get_producers/:offset', (req, res) => {
	   	 eos.getProducers({
      			json: true,
      			lower_bound: "string",
      			limit: req.params.offset
			})
	   	 	.then(result => {
	   	 		res.json(result);
	   	 	})
	   	 	.catch(err => {
	   	 		log.error(err);
	   	 		res.status(501).end();
	   	 	});
	});

    /*
	* router - get code
	* params - account name
	*/
	router.get('/api/v1/get_code/:account', (req, res) => {
	   	 eos.getCode({
      			json: true,
      			account_name: req.params.account,
			})
	   	 	.then(result => {
	   	 		res.json(result);
	   	 	})
	   	 	.catch(err => {
	   	 		log.error(err);
	   	 		res.status(501).end();
	   	 	});
	});

    /*
	* router - get currency balance
	*/
	router.get('/api/v1/get_currency_balance/:code/:account/:symbol', (req, res) => {
	   	 eos.getCurrencyBalance({
      			code: req.params.code,
      			account: req.params.account,
      			symbol: req.params.symbol
			})
	   	 	.then(result => {
	   	 		res.json(result);
	   	 	})
	   	 	.catch(err => {
	   	 		log.error(err);
	   	 		res.status(501).end();
	   	 	});
	});

    /*
	* router - get_table_rows producers
	*/
	router.get('/api/v1/get_table_rows/:code/:scope/:table/:limit', (req, res) => {
	   	 eos.getTableRows({
			      json: true,
			      code: req.params.code,
			      scope: req.params.scope,
			      table: req.params.table,
			      table_key: "string",
			      lower_bound: "0",
			      upper_bound: "-1",
			      limit: req.params.limit
			})
	   	 	.then(result => {
	   	 		res.json(result);
	   	 	})
	   	 	.catch(err => {
	   	 		log.error(err);
	   	 		res.status(501).end();
	   	 	});
	});

    /*
	* router - get_table_rows producers
	*/
	router.get('/api/custom/get_table_rows/:code/:scope/:table/:limit', (req, res) => {
		let formData = { json: true,
			      code: req.params.code,
			      scope: req.params.scope,
			      table: req.params.table,
			      limit: req.params.limit
		};
	   	request.post({url:`${config.customChain}/v1/chain/get_table_rows`, json: formData}).pipe(res);
	});

	router.post('/api/producer', (req, res) => {
		if (req.body.url && req.body.url.indexOf('eosweb.net') >= 0 ){
			return res.sendFile(path.join(__dirname, '../../bp.json'));
		}
	   	request.get(`${req.body.url}`).pipe(res);
	});

	/*
	* router - get_actions
	* params - account_name, position, offset
	*/
	router.get('/api/v1/get_actions/:account_name/:position/:offset', (req, res) => {
	   	 eos.getActions({ 
	   	 		account_name: req.params.account_name,
	   	 		pos: req.params.position,
	   	 		offset: req.params.offset
	   	 	})
	   	 	.then(result => {
	   	 		res.json(result);
	   	 	})
	   	 	.catch(err => {
	   	 		log.error(err);
	   	 		res.status(501).end();
	   	 	});
	});

	/*
	* router - get_transaction
	* params - transaction_id_type
	*/
	router.get('/api/v1/get_transaction/:transaction_id_type', (req, res) => {
	   	 eos.getTransaction({ id: req.params.transaction_id_type })
	   	 	.then(result => {
	   	 		res.json(result);
	   	 	})
	   	 	.catch(err => {
	   	 		log.error(err);
	   	 		res.status(501).end();
	   	 	});
	});

	/*
	* router - get_transactions
	* params - transaction_id_type
	*/
	router.get('/api/v1/get_transactions', (req, res) => {
	   	 eos.getTransaction({})
	   	 	.then(result => {
	   	 		res.json(result);
	   	 	})
	   	 	.catch(err => {
	   	 		log.error(err);
	   	 		res.status(501).end();
	   	 	});

	   	 	eos.getAccount({account_name: "eosio"})
	   	 	.then(result => {
	   	 		log.info(result);
	   	 	})
	   	 	.catch(err => {
	   	 		log.error(err);
	   	 		//res.status(501).end();
	   	 	});
	});

	/*
	* router - get_info
	*/
	router.get('/api/v1/get_info', (req, res) => {
	   	 eos.getInfo({})
	   	 	.then(result => {
	   	 		res.json(result);
	   	 	})
	   	 	.catch(err => {
	   	 		log.error(err);
	   	 		res.status(501).end();
	   	 	});
	});
	//============ END of HISTORY API


	//============ CHAIN API
	/*
	* router - get_currency_stats
	* params - code: 'name', symbol: 'string'
	*/
	router.get('/api/v1/get_currency_stats/:code/:symbol', (req, res) => {
	   	 eos.getCurrencyStats({
	   	 		//code: `${req.params.code}`,
	   	 		symbol: req.params.symbol
	   	 	})
	   	 	.then(result => {
	   	 		res.json(result);
	   	 	})
	   	 	.catch(err => {
	   	 		log.error(err);
	   	 		res.status(501).end();
	   	 	});
	});
	//============ END of CHAIN API

	//============ Account API
	/*
	* router - get_account
	* params - name
	*/
	router.get('/api/v1/get_account/:name', (req, res) => {
	   	 eos.getAccount({
	   	 		account_name: req.params.name
	   	 	})
	   	 	.then(result => {
	   	 		res.json(result);
	   	 	})
	   	 	.catch(err => {
	   	 		log.error(err);
	   	 		res.status(501).end();
	   	 	});
	});

	/*
	* router - get_account
	* params - name
	*/
	router.get('/api/v1/get_key_accounts/:key', (req, res) => {
	   	 eos.getKeyAccounts({
	   	 		public_key: req.params.key
	   	 	})
	   	 	.then(result => {
	   	 		res.json(result);
	   	 	})
	   	 	.catch(err => {
	   	 		log.error(err);
	   	 		res.status(501).end();
	   	 	});
	});

	/*
	* router - get_account_controlled
	* params - name
	*/
	router.get('/api/v1/get_controlled_accounts/:acccount', (req, res) => {
	   	 eos.getControlledAccounts({
	   	 		controlling_account: req.params.acccount
	   	 	})
	   	 	.then(result => {
	   	 		res.json(result);
	   	 	})
	   	 	.catch(err => {
	   	 		log.error(err);
	   	 		res.status(501).end();
	   	 	});
	});
	//============ END of Account API

	//============ Prod API
	/*
	* router - get_account
	* params - name
	*/
	router.get('/api/v1/get_currency_stats/:code/:symbol', (req, res) => {
	   	 eos.getAccount({
	   	 		code: req.params.code,
	   	 		//symbol: req.params.symbol
	   	 	})
	   	 	.then(result => {
	   	 		res.json(result);
	   	 	})
	   	 	.catch(err => {
	   	 		log.error(err);
	   	 		res.status(501).end();
	   	 	});
	});
	//============ END of Account API

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
	//============ end of SQL tokens API

// ============== end of exports 
};
























