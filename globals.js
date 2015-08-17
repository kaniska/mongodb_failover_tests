/**
 * New node file
 */
var fs  = require("fs");
global.config = {
	    properties: {
	    	  "mongo": {
	    		    "urls": process.env.MONGODB_REPLICASET || "localhost:27017",
	    		    "username": "",
	    		    "password": "",
	    		    "db": process.env.MONGODB_NAME || "test"
	    		  }
	    		}
};
