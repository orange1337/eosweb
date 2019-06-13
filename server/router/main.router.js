/*
* Created by Rost
*/
const path = require('path');

module.exports = function(router, config, request, log) {

	const indexPath = path.join(__dirname, '../../dist/index.html');

	router.get('/', (req, res) => {
		//res.cookie('netsConf', JSON.stringify(config.eosInfoConfigs), { path: '/' });
	   	res.sendFile(indexPath);
	});

	router.get('/block/:id', (req, res) => {
	   	res.sendFile(indexPath);
	});
	
	router.get('/account/:id', (req, res) => {
	   	res.sendFile(indexPath);
	});
	
	router.get('/address/:id', (req, res) => {
	   	res.sendFile(indexPath);
	});
	
	router.get('/producers', (req, res) => {
	   	res.sendFile(indexPath);
	});
	
	router.get('/producer/:id', (req, res) => {
	   	res.sendFile(indexPath);
	});
	
	router.get('/analytics', (req, res) => {
	   	res.sendFile(indexPath);
	});
	
	router.get('/accounts', (req, res) => {
	   	res.sendFile(indexPath);
	});

	router.get('/ram', (req, res) => {
	   	res.sendFile(indexPath);
	});

	router.get('/transaction/:id', (req, res) => {
	   	res.sendFile(indexPath);
	});

	router.get('/wallet', (req, res) => {
	   	res.sendFile(indexPath);
	});

	router.get('/vote', (req, res) => {
	   	res.sendFile(indexPath);
	});

	router.get('/tokens', (req, res) => {
	   	res.sendFile(indexPath);
	});

	router.get('/widget/ram', removeFrameguard, (req, res) => {
	   	res.sendFile(indexPath);
	});

	router.get('/notfound', (req, res) => {
	   	res.sendFile(indexPath);
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

	router.get('/test/widget', removeFrameguard, (req, res) => {
	   	res.sendFile(path.join(__dirname, '../../test_widget/index.html'));
	});
// ============== END of exports 
};

function removeFrameguard (req, res, next) {
  res.removeHeader('X-Frame-Options');
  next();
}















