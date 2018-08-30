/*
   Created by eoswebnetbp1
*/
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;

var MODEL_NAME = 'TRX_ACTIONS';
var TABLE_NAME = 'TRX_ACTIONS';
var MODEL;

var API = new mongoose.Schema({
  transactions: { 
    type: Number,
    index: true
  },
  actions: { 
    type: Number,
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



