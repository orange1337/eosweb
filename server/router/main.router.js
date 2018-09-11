/*
* Created by Rost
*/
const path = require('path');

module.exports = function(router, config, request, log) {

	router.get('/', (req, res) => {
		res.cookie('netsConf', JSON.stringify(config.eosInfoConfigs), { path: '/' });
	   	res.sendFile('index.html');
	});

	router.get('/bp.json', (req, res) => {
	   	res.sendFile(path.join(__dirname, '../../bp.json'));
	});

	router.get('/sitemap.xml', (req, res) => {
	   	res.sendFile(path.join(__dirname, '../../sitemap.xml'));
	});

	router.get('/robots.txt', (req, res) => {
	   	res.sendFile(path.join(__dirname, '../../robots.txt'));
	});
// ============== END of exports 
};
















