/*
	Utils functions
*/

class asyncWrapper {
	constructor (log){
		this.log = log;
	}
	toStrong (promise){
		return promise.then(result => result)
				  	  .catch(err => {
			  			  	this.log.error(err);
			  			  	process.exit(1);
				  	  });
	}
	to (promise){
		return promise.then(result => [null, result])
		  	  .catch(err => [err, null]);
	}
}

async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
       await callback(array[index], index, array);
  }
}

module.exports = { asyncWrapper, asyncForEach };