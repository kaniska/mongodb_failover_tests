var http = require('http');

var payload = "";
var payloadJSONobj=JSON.stringify(payload);

//prepare the header
var postheaders = {
    'Content-Type' : 'application/json',
    'Content-Length' : Buffer.byteLength(payloadJSONobj)
};

var qryCriteriaPayload = "";
var qryCriteriaObj=encodeURIComponent(JSON.stringify(qryCriteriaPayload));

var getheaders = {
	    'Content-Type' : 'application/json',
	    'Content-Length' : Buffer.byteLength(qryCriteriaObj)
	};
var options_get_localhost = {
	    host : 'localhost', // here only the domain name
	    port : 3004,
	    path : '/rest/api/count/',
	    method : 'GET',
	    headers : getheaders 
	};



////// Function Definitions
//CREATE Record
createPipeline = function createPipeline(callback) {
	var payload1 = {};
    var payloadJSONobj1=JSON.stringify(payload1);
    var url = '/rest/api/';
    var postheaders = {
    	    'Content-Type' : 'application/json',
    	    'Content-Length' : Buffer.byteLength(payloadJSONobj1)
    	};
    var options_post_localhost = {
    		 	host : 'localhost', // here only the domain name
    		    port : 3004,
    		    path : url, // the rest of the url with parameters if needed
    		    method : 'POST',
    		    headers : postheaders 
    		};///
	
	console.info('Create new records ... ');
	var insertReq = http.request(options_post_localhost, function(response) {
	    console.log("statusCode: ", response.statusCode);
	    var rawData = "";
		response.on('data', function(chunk) {
			rawData += chunk;
		});
		response.on('end',function() {
			var jsonData = JSON.parse(rawData);
			console.info('Got Result : '+ JSON.stringify(jsonData));
	    	callback(jsonData);
		});
	    
	});
	// write the json data
	insertReq.write(payloadJSONobj1);
	insertReq.end();
	insertReq.on('error', function(e) {
		console.error('Error Message ');
	    console.error(e);
	});
}

//// GET Records
searchPipeline = function searchPipeline(callback) {
	console.info('\nNow Count Data .... ');
	var searchReq = http.request(options_get_localhost, function(response) {
	    console.log("statusCode: ", response.statusCode);
	    var data = "";
	    response.on('data', function(chunk) {
			data += chunk;
		});
		response.on('end',function() {
			console.info('Got Result :  '+data);
	    	callback();
		});
	    
	});
	// write the json data
	searchReq.write(qryCriteriaObj);
	searchReq.end();
	searchReq.on('error', function(e) {
		console.error('Error Message ');
	    console.error(e);
	});
}

///

createPipeline(function(pipelineId) {
		searchPipeline(function() {
		}); 
}); 

///////////////////////////////////