/*
   Created by eoswebnetbp1
*/
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;

var MODEL_NAME = 'Accounts';
var TABLE_NAME = 'Accounts';
var MODEL;

var API = new mongoose.Schema({
  account_name: { 
    type: String,
    index: true
  },
  balance: { 
    type: Array
  },
  staked: {
    type: Number,
    index: true
  },
  unstaked: {
    type: Number,
    index: true
  },
  balance_eos: {
    type: Number,
    index: true
  },
  ram_quota: {
    type: Number,
    index: true
  },
  ram_usage: {
    type: Number,
    index: true
  },
  created: { 
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



