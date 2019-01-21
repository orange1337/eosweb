/*
   Created by eoswebnetbp1
*/
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;

var MODEL_NAME = 'Stats';
var TABLE_NAME = 'Stats';
var MODEL;

var API = new mongoose.Schema({
  transactions: { 
    type: Number,
    default: 0 
  },
  actions: { 
    type: Number,
    default: 0 
  },
  accounts: { 
    type: Number,
    default: 0 
  },
  cursor_block: { 
    type: Number,
    default: 0 
  },
  cursor_accounts: {
    type: Number,
    default: 0 
  },
  max_tps: {
    type: Number,
    default: 0
  },
  max_aps: {
    type: Number,
    default: 0
  },
  cursor_max_tps: {
    type: Number,
    default: 0
  },
  max_tps_block: {
    type: Number,
    default: 0
  },
  last_update: { 
    type: Date
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



