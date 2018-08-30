/*
   Created by eoswebnetbp1
*/
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;

var MODEL_NAME = 'RAM';
var TABLE_NAME = 'RAM';
var MODEL;

var API = new mongoose.Schema({
  quote: { 
    type: String
  },
  base: { 
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



