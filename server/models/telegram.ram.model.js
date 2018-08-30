/*
   Created by eoswebnetbp1
*/
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;

var MODEL_NAME = 'TELEGRAM_RAM';
var TABLE_NAME = 'TELEGRAM_RAM';
var MODEL;

var API = new mongoose.Schema({
  chatId: { 
    type: String,
    index: true
  },
  active: { 
    type: Boolean,
    index: true,
    default: true
  },
  high: {
    type: Number,
    index: true,
    default: 0
  },
  low: {
    type: Number,
    index: true,
    default: 0
  },  
  stopLoss: {
    type: Number,
    index: true,
    default: 0
  },
  userName: {
    type: String,
    index: true
  },
  date: {
    index: true,
    type: Date,
    default: Date.now
  }
});


module.exports = function (connection) {
  if ( !MODEL ) {
    if ( !connection ) {
      connection = mongoose;
    }
    MODEL = connection.model(MODEL_NAME, API, TABLE_NAME);
  }
  return MODEL;
};



