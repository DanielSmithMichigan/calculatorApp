/*
 * @Author DSmith
 * requestHandler is responsible for taking get and post (currently only post) requests and returning the appropriate response
 */
 
function requestHandler(expressionEvaluator) {
	this.expressionEvaluator = expressionEvaluator;
}
requestHandler.prototype.handleRequest = function(requestBody, configuration, callback) {
	var output = {};
	switch(requestBody.action) {
		case 'performCalculation':
			this.expressionEvaluator.refreshConfiguration(function(err) {
				this.expressionEvaluator.evaluateExpression(requestBody.symbolStack, function(err, data) {
					if (err) {
						output.expression_result = err;
						callback(err, output);
					} else {
						output.expression_result = data;
						callback(null, output);
					}
				});
			}.bind(this));
		break;
	}	
}

module.exports = requestHandler;