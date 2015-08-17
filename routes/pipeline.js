var Hapi = require('hapi');

module.exports = function (application) {
  var dbService = require('./../dbService.js');

  /**
   * Count data 
   */
  application.route({
  	  method: 'GET', 
  	  path: '/rest/api/count/', 
  	  config: {
  	  handler: function(req, reply) {
  		dbService.countItems("iPhone", function(err, result){
  			reply(result).header("Access-Control-Allow-Origin", "*").header("Access-Control-Allow-Headers", "X-Requested-With");
		  });
  	   } // end handler
  	  } // end config
  	});
  
  /**
   * Post data
   */
	application.route({
		  method: 'POST', 
	  	  path: '/rest/api/', 
	  	  config: {
	  	      handler: function(request, reply) {
		  	  	  dbService.createItem({itemName:"iPhone", price:"200"}, function(err, result){
		  	    	  reply(result).header("Access-Control-Allow-Origin", "*").header("Access-Control-Allow-Headers", "X-Requested-With");
		  	  	  });
	  	      } // end handler
	  	    } // end config
		});
};