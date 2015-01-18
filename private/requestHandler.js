function requestHandler(expressionEvaluator) {
	this.expressionEvaluator = expressionEvaluator;
}
requestHandler.prototype.handleRequest = function(requestBody, callback) {
	var output = {};
	switch(requestBody.action) {
		case 'performCalculation':
			this.expressionEvaluator.evaluateExpression(requestBody.symbolStack, function(err, data) {
				if (err) {
					callback(err);
				} else {
					output.expression_result = data;
					callback(null, output);
				}
			});
		break;
	}	
}

module.exports = requestHandler;