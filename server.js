require('./globals.js');
Hapi = require('hapi'),
loader = require('node-glob-loader');

process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';

var serverOptions = { cors: true};
httpServer = Hapi.createServer(3004, serverOptions);

var errorText = "";
httpServer.on('internalError', function(request, err) {
	errorText = err.message;
	console.log("Server Error : "+err);
});

httpServer.ext('onPreResponse', function (request, reply) {
    if (request.response.isBoom) {
       var error = request.response;
       error.output.payload.message = errorText;
   }
  reply();
});

loader.load('./routes/*', function(exports) {
	exports(httpServer);
	}).then(
		function() {
			httpServer.start(function() {
				console.log('Server Started @' + new Date() 
						+ 3004);
			});
		}).then(function() {
			require('./dbService.js').initialize();
			});

//this function is called when you want the server to die gracefully
//i.e. wait for existing connections
var gracefulShutdown = function() {
console.log("Received kill signal, shutting down gracefully.");
httpServer.stop({ timeout: 6 * 1000 }, function () {
	   console.log('Server stopped #### ');
	   process.exit();
	});
}
//listen for TERM signal .e.g. kill 
process.on ('SIGTERM', gracefulShutdown);
//listen for INT signal e.g. Ctrl-C
process.on ('SIGINT', gracefulShutdown);   