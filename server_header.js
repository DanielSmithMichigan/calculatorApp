var dbHandler = require('./private/dbHandler.js');
var configuration = require('./private/configuration.js');
var expressionEvaluator = require('./private/expressionEvaluator.js');
var requestHandler = require('./private/requestHandler.js');

dbHandler = new dbHandler(function () {
	configuration.updateConfiguration({}, function(err, config) {
	});
});
configuration = new configuration(dbHandler);
expressionEvaluator = new expressionEvaluator(configuration);
requestHandler = new requestHandler(expressionEvaluator);