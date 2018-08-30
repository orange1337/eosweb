/*
   Created by eoswebnetbp1
*/
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;

var MODEL_NAME = 'RAM_ORDERS';
var TABLE_NAME = 'RAM_ORDERS';
var MODEL;

var API = new mongoose.Schema({
  account: { 
    type: String,
    index: true
  },
  amount: { 
    type: String
  },
  type: {
    type: String,
    index: true
  },
  tx_id: {
    type: String
  },
  price: {
    type: String
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



