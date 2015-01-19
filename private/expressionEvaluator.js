/*
 * @Author DSmith
 * expressionEvaluator is responsible for managing and evaluation mathematical expressions
 */
 
var expressionEvaluator = function(configuration, general) {
	this.configuration = configuration;
	this.general = general;
	this.op_priority = {};
	this.op_types = {};
}

/*
 * @Author DSmith
 * refreshConfiguration will refresh the local configuration object with regards to variables relevant to the evaluation of expressions
 */

expressionEvaluator.prototype.refreshConfiguration = function(callback) {
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

/*
 * @Author DSmith
 * evaluateExpression will evaluate an infix expression
 */

expressionEvaluator.prototype.evaluateExpression = function(original_expression, callback) {
	// instantiate variables
	var error = false;
	var output;
	var total_numbers = 0;
	var total_operators = 0;
	
	// convert expression from infix to post fix
	this.convertToPostFix(original_expression, function(err, postfix_expression) {
		if (err) {
			callback(err);
		} else {
			
			// instantiate variables
			var value_stack = [];
			var curr_symbol;
			var curr_type;
			var first_value;
			var second_value;
			
			// iterate over each symbol in expression
			for (var i = 0; i < postfix_expression.length; i++) {
			
				// instantiate variables
				curr_symbol = postfix_expression[i];
				curr_type = this.op_types[curr_symbol];
				
				if (this.general.is_numeric(curr_symbol)) {
				
					// if the symbol is a number, push it to the stack
					value_stack.push(curr_symbol);
					total_numbers++;
				} else if (curr_type === 'operators') {
					
					// if the symbol is an operator, pop two numbers off the stack, and use the operator on them, then push the result on the stack
					first_value = value_stack.pop();
					second_value = value_stack.pop();
					if (typeof first_value === 'undefined' || typeof second_value === 'undefined') {
						error = 'Malformed Expression';
						break;
					} else {
						value_stack.push(this.performOperation(curr_symbol, first_value, second_value));
					}
					total_operators++;
				}
				
				// check if total numbers or operators is greater than the configuration (someone must have been messing with the client side config)
				if (total_numbers > this.configuration.config_public.max_numbers) {
					error = 'Max numbers of numbers exceeded';
					break;
				} else if (total_operators > this.configuration.config_public.max_operators) {
					error = 'Max number of operators exceeded';
					break;
				}
			}
			
			// pop the final result off the stack
			output = value_stack.pop();
			if (typeof output === 'undefined') {
				error = 'Malformed Expression';
			}
			if (error) { 
				callback(error);
			} else {
				callback(null, output);
			}
		}
	}.bind(this));
}

/*
 * @Author DSmith
 * performOperation will accept two values and an operator, and use the operator to find a result
 */

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

/*
 * @Author DSmith
 * convertToPostFix will convert an infix expression to a postfix expression (which is easier to evaluate)
 */

expressionEvaluator.prototype.convertToPostFix = function(expression, callback) {
	// check if the parentheses are balanced
	this.balanceParentheses(expression, function(err) {
		if (err) {
			callback(err);
		} else {
			// instantiate variables
			var result = [];
			var operators = [];
			var curr_symbol;
			var curr_type;
			var top_operator;
			var curr_operator_priority;
			var comparison_operator_priority;
			
			// iterate over each symbol in expression
			for (var i = 0; i < expression.length; i++) {
				curr_symbol = expression[i];
				curr_type = this.op_types[curr_symbol];
				
				// if it's a number, push it onto the result stack
				if (this.general.is_numeric(curr_symbol)) {
					result.push(curr_symbol);
				} if (curr_type === 'operators') {
					// if it's an operator, do one of the following:
					// if there are no operators on the operator stack, push this operator to the operator stack
					if (operators.length === 0) {
						operators.push(curr_symbol);
					} else {
					
						// instantiate variables
						curr_operator_priority = this.op_priority[curr_symbol];
						comparison_operator_priority = this.op_priority[operators.slice(-1)[0]];
						
						if (comparison_operator_priority < curr_operator_priority) {
							// if the top operator on the operator stack is lower priority than our current one, push the current one on the stack
							operators.push(curr_symbol);
						} else {
							/* if the top operator on the operator stack is higher priority than the current one, 
							 * continually pop operators off the operator stack, and push them onto the results stack
							 * until either the operator stack is empty, or our current operator is the highest priority operator
							 * on the operator stack
							 */
							while (comparison_operator_priority !== false && comparison_operator_priority >= curr_operator_priority) {
								result.push(operators.pop());
								if (operators.length) {
									comparison_operator_priority = this.op_priority[operators.slice(-1)[0]]
								} else {
									comparison_operator_priority = false;
								}
							}
							
							// push our operator onto the operator stack
							operators.push(curr_symbol);
						}
					}
				}
			}
			
			// remove all remaining operators from the operator stack, and push them onto the results stack
			while(operators.length) {
				result.push(operators.pop());
			}
			
			// callback with results stack
			callback(null,result);
		}
	}.bind(this));	
}

/*
 * @Author DSmith
 * balanceParentheses will return an error if parentheses are not balanced
 */

expressionEvaluator.prototype.balanceParentheses = function(expression, callback) {
	var open_par = [];
	var error = false;
	
	// iterate over all parentheses in expression
	for(var i = 0; i < expression.length; i++) {
	
		// if open parentheses, push onto stack
		if (expression[i] === '(') {
			open_par.push(expression[i]);
		} else if (expression[i] === ')') {
			// if close parentheses, pop off stack
			
			// if there isn't an open parentheses to pop off stack, then we have a premature close parentheses
			if (open_par.length <= 0) {
				error = 'Parentheses not balanced';
				break;
			} else {
				open_par.pop();
			}
		}
	}
	
	// if stack isn't empty after evaluation, then there are too many open parentheses
	if (open_par.length > 0) {
		error = 'Parentheses not balanced';
	}
	
	// return error or nothing
	if (error) {
		callback(error);
	} else {
		callback(null);
	}
}

module.exports = expressionEvaluator;