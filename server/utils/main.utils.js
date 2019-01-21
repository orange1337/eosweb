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

module.exports = { asyncWrapper };