/*
* Created by Rost
*/
const EOS 		= require('eosjs');

const wif 		= '5KQwrPbwdL6PhXujxW37FSSQZ1JiwsST4cqQzDeyXtP79zkvFD3';
const pubkey 	= 'EOS6MRyAjQq8ud7hVNYcfnVPJqcVpscN5So8BhtHuGYqET5GDW5CV';
const eos 		= EOS.Localnet({keyProvider: wif});

module.exports 	= function(router, config, request, log) {

	router.get('/api/v1/get_block/:block_num_or_id', (req, res) => {
	   	 eos.getBlock({ block_num_or_id: req.params.block_num_or_id })
	   	 	.then(result => {
	   	 		res.json(result);
	   	 	})
	   	 	.catch(err => {
	   	 		log.error(err);
	   	 		res.status(501).end();
	   	 	})
	});

// ============== END of exports 
};

























