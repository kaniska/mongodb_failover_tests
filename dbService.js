require('./globals.js');
var safe_params = { j: 1, w: 1, wtimeout: 10000 };

var MongoClient = require('mongodb').MongoClient;
var ReadPreference = require('mongodb').ReadPreference;

var mongoConfig = config.properties.mongo;

var mongoConnectionURL = 'mongodb://'+ mongoConfig.urls +'/'+ mongoConfig.db+"?";
var test_collection;
var m_db;
var mongoclient;	
/**
 * Initialize MongoDB Collections
 */
exports.initialize = function initialize() {
	if(!m_db) {
		
		console.log( "Initializing DB " + mongoConnectionURL );
		
		// mongoclient = new MongoClient(new Server(mongoConnectionURL), {w:2}, {native_parser: true});
		// replicaSet=rs0&readPreference=primaryPreferred
		MongoClient.connect(mongoConnectionURL,  {
		    db: {
			      native_parser: true,
			      w: 1,
			      wtimeout: 5000,
			      journal: true,
			      readPreference:ReadPreference.PRIMARY_PREFERRED,
			      native_parser: true
			    },
			    server: {
			    	readPreference: ReadPreference.PRIMARY_PREFERRED,
			    	poolSize: 10,
			    	auto_reconnect: true,
			      socketOptions: {
			        connectTimeoutMS: 500
			      }
			    },
			    replSet: {
			    	rs_name: 'rs0',
			    	readPreference: ReadPreference.PRIMARY_PREFERRED
			    }
			  },  function(err, database) {

			m_db = database;
			if (err) {
				console.log("Connecting with Mongo DB" + err.message);
					throw(err);
			}
			console.log("Successfully connected to Mongo DB");
			test_collection = database.collection('test_data');
			
	 });
   };

};

/**
 * Get  Data 
 */
exports.countItems = function countItems(itemName, callback) {
	console.log( "Get data from DB" );
	
		test_collection.count( {"itemName":itemName}, function(err, result) {
			if(err) {
				console.log( "Failed to fetch data : " + err.message);
			}else{
				console.log( "Found data count :  " + result);
			}
			callback(err, result);
	   });
};	

/**
 * Create  payload 
 */
exports.createItem = function createItem(payload, callback){
	console.log( "Create data in DB" );
	

	    test_collection.insert(payload, function(err, result) {
	    	if(err) {
				console.log( "Failed to insert data : " + err.message);
			}else{
				console.log( "Inserted data : " + JSON.stringify(result));
			}
			callback(err, result);
		});
};		


 