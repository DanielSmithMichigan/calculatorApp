// include classes
var dbHandler = require('./private/dbHandler.js');

// start database connection and get configuration
dbHandler = new dbHandler(function () {
	dbHandler.installDb();
});