
const configName    = (process.env.CONFIG) ? process.env.CONFIG : 'config';
const config        = require(`../../${configName}`);

const { logWrapper } = require('../utils/main.utils');
const log            = new logWrapper('ram_bot');

const async  = require('async');

const TelegramBot = require('node-telegram-bot-api');
const bot         = new TelegramBot(config.telegram.TOKEN, { polling: true });

module.exports = function(mongoMain){

	const TELEGRAM_USERS = require('../models/telegram.ram.model')(mongoMain);
	
	bot.onText(/\/start/, (msg, match) => {
			if (!msg && !msg.chat && !msg.chat.id){
				return log.error('Wrong chat id 1', msg);
			}
			saveUser(TELEGRAM_USERS, msg, err => {
				if (err){
					return log.error(err);
				}
				bot.sendMessage(msg.chat.id, `
				 Hello and welcome to EOSweb RAM bot alerts :)
				 	Queries example:
					- /high 0.34 (Set top RAM position)
					- /low 0.26 
					- /stop_loss 0.3 
					- /info  (Get info about your bot parameters)
					- /price (Get gurrent RAM price) 
					- /high 0 (disable high) 
					- /low 0, 
					- /stop_loss 0
					- /disable (disable bot)
					- /enable (enable bot)
				`);
			});
	});

	bot.onText(/\/high (.+)/, (msg, match) => {
			if (!msg && !msg.chat && !msg.chat.id){
				return log.error('Wrong chat id 2', msg);
			}
			let high = Number(match[1]);
			if (isNaN(high)){
				return log.error('High ', match);
			}
			TELEGRAM_USERS.update({ chatId: msg.chat.id }, { high: high }, err => {
				if (err){
					return log.error(err);
				}
				bot.sendMessage(msg.chat.id, 'High position successfully updated!');
			});
	});

	bot.onText(/\/low (.+)/, (msg, match) => {
			if (!msg && !msg.chat && !msg.chat.id){
				return log.error('Wrong chat id 3', msg);
			}
			let low = Number(match[1]);
			if (isNaN(low)){
				return log.error('low ', match);
			}
			TELEGRAM_USERS.update({ chatId: msg.chat.id }, { low: low }, err => {
				if (err){
					return log.error(err);
				}
				bot.sendMessage(msg.chat.id, 'Low position successfully updated!');
			});
	});

	bot.onText(/\/stop_loss (.+)/, (msg, match) => {
			if (!msg && !msg.chat && !msg.chat.id){
				return log.error('Wrong chat id 4', msg);
			}
			let stopLoss = Number(match[1]);
			if (isNaN(stopLoss)){
				return log.error('stopLoss ', match);
			}
			TELEGRAM_USERS.update({ chatId: msg.chat.id }, { stopLoss: stopLoss }, err => {
				if (err){
					return log.error(err);
				}
				bot.sendMessage(msg.chat.id, 'Stop Loss position successfully updated!');
			});
	});

    bot.onText(/\/info/, (msg, match) => {
			if (!msg && !msg.chat && !msg.chat.id){
				return log.error('Wrong chat id 5', msg);
			}
			TELEGRAM_USERS.findOne({ chatId: msg.chat.id }, (err, result) => {
				if (err){
					return log.error(err);
				}
				if (!result){
					return bot.sendMessage(msg.chat.id, 'User not found!');
				}
				bot.sendMessage(msg.chat.id, `High = ${ result.high }, Low = ${ result.low }, Stop Loss = ${ result.stopLoss }, active = ${result.active}`);
			});
	});
    
    bot.onText(/\/price/, (msg, match) => {
			if (!msg && !msg.chat && !msg.chat.id){
				return log.error('Wrong chat id 5', msg);
			}
			global.eos.getTableRows({
	               json: true,
	               code: "eosio",
	               scope: "eosio",
	               table: "rammarket",
	               limit: 10
	           })
	            .then(result => {
					let ramPrice = countRamPrice(result);
					bot.sendMessage(msg.chat.id, `ram price = ${ramPrice.toFixed(5)} EOS`);
				});
	});

	bot.onText(/\/disable/, (msg, match) => {
			if (!msg && !msg.chat && !msg.chat.id){
				return log.error('Wrong chat id 6', msg);
			}
			TELEGRAM_USERS.update({ chatId: msg.chat.id }, { active: false }, err => {
				if (err){
					return log.error(err);
				}
				bot.sendMessage(msg.chat.id,`Bot successfully disabled!`);
			});
	});
	
	bot.onText(/\/enable/, (msg, match) => {
			if (!msg && !msg.chat && !msg.chat.id){
				return log.error('Wrong chat id 7', msg);
			}
			TELEGRAM_USERS.update({ chatId: msg.chat.id }, { active: true }, err => {
				if (err){
					return log.error(err);
				}
				bot.sendMessage(msg.chat.id,`Bot successfully enabled!`);
			});
	});

	function getRamPrice(){
		setTimeout(() => {
			global.eos.getTableRows({
	               json: true,
	               code: "eosio",
	               scope: "eosio",
	               table: "rammarket",
	               limit: 10
	           })
	            .then(result => {
					let ramPrice = countRamPrice(result);
					//log.info('==== ram', ramPrice, 'EOS');
					findActiveUsers(TELEGRAM_USERS, ramPrice, (err, result) => {
							if (err){
								   log.error(err);
							}
							let message = `ram price = ${ramPrice.toFixed(5)} EOS, https://eosweb.net/ram`;
							if (result && result.high){
								result.high.forEach(elem => {
								  	bot.sendMessage(elem.chatId, `High - ${message}`);
								  	TELEGRAM_USERS.update({ chatId: elem.chatId }, { high: 0 }, err => {
								  		if (err){
								  			return log.error(err);
								  		}
								  	});
								});
							}
							if (result && result.low){
								result.low.forEach(elem => {
								  	bot.sendMessage(elem.chatId, `Low - ${message}`);
								  	TELEGRAM_USERS.update({ chatId: elem.chatId }, { low: 0 }, err => {
								  		if (err){
								  			return log.error(err);
								  		}
								  	});
								});
							}
							if (result && result.stopLoss){
								result.stopLoss.forEach(elem => {
								  	bot.sendMessage(elem.chatId, `Stop Loss - ${message}`);
								  	TELEGRAM_USERS.update({ chatId: elem.chatId }, { stopLoss: 0 }, err => {
								  		if (err){
								  			return log.error(err);
								  		}
								  	});
								});
							}
							getRamPrice();
					});
	            });
		}, config.telegram.TIME_UPDATE);
	}
	getRamPrice();
}

function findActiveUsers(TELEGRAM_USERS, price, callback){
		async.parallel({
			high: cb => {
				TELEGRAM_USERS.find({ active: true, high: { $lte: price, $ne: 0 } }, cb);
			},
			low: cb => {
				TELEGRAM_USERS.find({ active: true, low: { $gte: price, $ne: 0 } }, cb);
			},
			stopLoss: cb => {
				TELEGRAM_USERS.find({ active: true, stopLoss: { $gte: price, $ne: 0 } }, cb);
			} 
		}, (err, result) => {
		 		if (err){
		 			return callback(err);
		 		}
			  	callback(null, result);
		});
}

function saveUser(TELEGRAM_USERS, message, callback){
		 TELEGRAM_USERS.findOne({ chatId: message.chat.id }, (err, result) => {
		 		if (err){
		 			return callback(err);
		 		}
		 		if (result){
		 			log.info('User already exist!');
		 			return callback(null);
		 		}
		 		let user = new TELEGRAM_USERS({
		 			chatId: message.chat.id,
		 			userName: message.chat.username  
		 		});
		 		user.save(err => {
		 			if (err){
		 				return callback(err)
		 			}
		 			callback(null);
		 		});
		 });
}

function countRamPrice(result) {
        if (!result || !result.rows || !result.rows[0] || !result.rows[0].quote || !result.rows[0].base){
                return console.error('======= data empty ram price', result);
        }
        let data = result.rows[0];
        let quoteBalance  = Number(data.quote.balance.split(' ')[0]);
        let baseBalance   = Number(data.base.balance.split(' ')[0]);
        if (isNaN(quoteBalance) || isNaN(baseBalance)){
        		return console.error('======= quoteBalance , baseBalance', quoteBalance, baseBalance);
        }
        return quoteBalance / baseBalance * 1024;
}


