var expressionEvaluator = function(configuration, general) {
	this.configuration = configuration;
	this.general = general;
	this.op_priority = {};
	this.op_types = {};
}

expressionEvaluator.prototype.refreshConfiguration = function(options, callback) {
	this.configuration.retrieveConfiguration({refreshOnCalc: true}, function(err) {
		var import_types = ['numbers', 'operators'];
		for (var i = 0; i < import_types.length; i++) {
			var curr_import = this.configuration.config_public[import_types[i]];
			for (var j in curr_import) {
				this.op_types[curr_import[j]] = import_types[i];
			}
		}
		this.op_priority = this.configuration.config_public.operator_priority;
		callback(null);
	}.bind(this));
}

expressionEvaluator.prototype.evaluateExpression = function(original_expression, callback) {
	var error = false;
	var output;
	this.convertToPostFix(original_expression, function(err, postfix_expression) {
		if (err) callback(err)
			else {
			var value_stack = [];
			var curr_symbol;
			var curr_type;
			var first_value;
			var second_value;
			for (var i = 0; i < postfix_expression.length; i++) {
				curr_symbol = postfix_expression[i];
				curr_type = this.op_types[curr_symbol];
				if (this.general.is_numeric(curr_symbol)) {
					value_stack.push(curr_symbol);
				} else if (curr_type === 'operators') {
					first_value = value_stack.pop();
					second_value = value_stack.pop();
					if (typeof first_value === 'undefined' || typeof second_value === 'undefined') {
						error = 'Malformed Expression';
						break;
					} else {
						value_stack.push(this.performOperation(curr_symbol, first_value, second_value));
					}
				}
			}
			output = value_stack.pop();
			if (typeof output === 'undefined') {
				error = 'Malformed Expression';
			}
			if (error) callback(error)
			else callback(null, output);
		}
	}.bind(this));
}

expressionEvaluator.prototype.performOperation = function(operator, second_value, first_value) {
	var output = false;
	first_value = parseFloat(first_value);
	second_value = parseFloat(second_value);
	if (operator === '+') {
		output = first_value + second_value;
	} else if (operator === '-') {
		output = first_value - second_value;
	} else if (operator === '*') {
		output = first_value * second_value;
	} else if (operator === '/') {
		output = first_value / second_value;
	}
	return output;
}

expressionEvaluator.prototype.convertToPostFix = function(expression, callback) {
	this.refreshConfiguration({}, function (err) {
		if (err) {callback(err);}
		else {
			this.balanceParentheses(expression, function(err) {
				if (err) {callback(err);}
				else {
					var result = [];
					var operators = [];
					var curr_symbol;
					var curr_type;
					var top_operator;
					var curr_operator_priority;
					var comparison_operator_priority;
					for (var i = 0; i < expression.length; i++) {
						curr_symbol = expression[i];
						curr_type = this.op_types[curr_symbol];
						if (this.general.is_numeric(curr_symbol)) {
							result.push(curr_symbol);
						} if (curr_type === 'operators') {
							if (operators.length === 0) {
								operators.push(curr_symbol);
							} else {
								curr_operator_priority = this.op_priority[curr_symbol];
								comparison_operator_priority = this.op_priority[operators.slice(-1)[0]];
								if (comparison_operator_priority < curr_operator_priority) {
									operators.push(curr_symbol);
								} else {
									while (comparison_operator_priority !== false && comparison_operator_priority >= curr_operator_priority) {
										result.push(operators.pop());
										if (operators.length) {
											comparison_operator_priority = this.op_priority[operators.slice(-1)[0]]
										} else {
											comparison_operator_priority = false;
										}
									}
									operators.push(curr_symbol);
								}
							}
						}
					}
					while(operators.length) {
						result.push(operators.pop());
					}
					callback(null,result);
				}
			}.bind(this));		
		}
	}.bind(this));
}

expressionEvaluator.prototype.balanceParentheses = function(expression, callback) {
	var open_par = [];
	var error = false;
	for(var i = 0; i < expression.length; i++) {
		if (expression[i] === '(') {
			open_par.push(expression[i]);
		} else if (expression[i] === ')') {
			if (open_par.length <= 0) {
				error = 'Parentheses not balanced';
				break;
			} else {
				open_par.pop();
			}
		}
	}
	if (open_par.length > 0) {
		error = 'Parentheses not balanced';
	}
	callback(error);
}

module.exports = expressionEvaluator;