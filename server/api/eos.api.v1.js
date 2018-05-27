/*
* Created by Rost
*/
const EOS 		= require('eosjs');

//const wif 	= '5KQwrPbwdL6PhXujxW37FSSQZ1JiwsST4cqQzDeyXtP79zkvFD3';
//const pubkey 	= 'EOS6MRyAjQq8ud7hVNYcfnVPJqcVpscN5So8BhtHuGYqET5GDW5CV';
const eos 		= EOS.Localnet();

module.exports 	= function(router, config, request, log) {

    //============ HISTORY API
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
	   	 eos.getInfo({ transaction_id_type: req.params.transaction_id_type })
	   	 	.then(result => {
	   	 		res.json(result);
	   	 	})
	   	 	.catch(err => {
	   	 		log.error(err);
	   	 		res.status(501).end();
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
	   	 		symbol: `${req.params.symbol}`
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

// ============== END of exports 
};

























