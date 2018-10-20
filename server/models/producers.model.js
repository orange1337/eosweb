/*
   Created by eoswebnetbp1
*/
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;

var MODEL_NAME = 'Producers';
var TABLE_NAME = 'Producers';
var MODEL;

var Producers = new mongoose.Schema({
    name: {
       type: String,
       index: true
    },
    image: {
       type: String
    },
    location: {
       type: String,
       index: true
    }
});


module.exports = function (connection) {
  if ( !MODEL ) {
    if ( !connection ) {
      connection = mongoose;
    }
    MODEL = connection.model(MODEL_NAME, Producers, TABLE_NAME);
  }
  return MODEL;
};



