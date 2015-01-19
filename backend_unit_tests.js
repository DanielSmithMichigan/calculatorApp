var assert = require('chai').assert;
var dbHandler = require('./private/dbHandler.js');
var configuration = require('./private/configuration.js');
var expressionEvaluator = require('./private/expressionEvaluator.js');
var requestHandler = require('./private/requestHandler.js');
var general = require('./private/general.js');

dbHandler = new dbHandler(function () {
	configuration.retrieveConfiguration({}, function(err) {
	});
});

general = new general();
configuration = new configuration(dbHandler);
expressionEvaluator = new expressionEvaluator(configuration, general);
requestHandler = new requestHandler(expressionEvaluator);

describe('Expression Evaluator', function () {
	it('Balance Parentheses', function () {
		var expression = ['9', '+', '4'];
		expressionEvaluator.balanceParentheses(expression, function(err) {
			assert.notOk(err, 'Pass Test, no parentheses');
		});
		expression = ['(', '+', '4'];
		expressionEvaluator.balanceParentheses(expression, function(err) {
			assert.ok(err, 'Fail Test, extra open parentheses');
		});
		expression = ['(', ')', ')'];
		expressionEvaluator.balanceParentheses(expression, function(err) {
			assert.ok(err, 'Fail Test, extra closed parentheses');
		});
		expression = ['(', ')'];
		expressionEvaluator.balanceParentheses(expression, function(err) {
			assert.notOk(err, 'Pass Test, equal open and closed');
		});
		expression = ['(', '1', '2', '3', '4', ')'];
		expressionEvaluator.balanceParentheses(expression, function(err) {
			assert.notOk(err, 'Pass Test, equal open and closed, numbers in between');
		});
		expression = ['(', '1', '(', ')', '4', ')'];
		expressionEvaluator.balanceParentheses(expression, function(err) {
			assert.notOk(err, 'Pass Test, equal open and closed, multiple sets');
		});
		expression = ['(', '1', '(', ')', ')', ')'];
		expressionEvaluator.balanceParentheses(expression, function(err) {
			assert.ok(err, 'Fail Test, one extra close, multiple sets');
		});
	});
	it('Convert to postFix', function() {
		expressionEvaluator.refreshConfiguration(function(err) {
			var expression = ['9', '+', '4'];
			expressionEvaluator.convertToPostFix(expression, function(err, output) {
				assert.deepEqual(output, ['9', '4', '+'], 'reg example 1');
			});
		});
		expressionEvaluator.refreshConfiguration(function(err) {
			var expression = ['4', '+', '9'];
			expressionEvaluator.convertToPostFix(expression, function(err, output) {
				assert.deepEqual(output, ['4', '9', '+'], 'reg example 2');
			});
		});
		
		expressionEvaluator.refreshConfiguration(function(err) {
			var expression = ['4', '-', '9'];
			expressionEvaluator.convertToPostFix(expression, function(err, output) {
				assert.deepEqual(output, ['4', '9', '-'], 'reg example 3');
			});
		});
		expressionEvaluator.refreshConfiguration(function(err) {
			var expression = ['8', '*', '4', '-', '9'];
			expressionEvaluator.convertToPostFix(expression, function(err, output) {
				assert.deepEqual(output, ['8', '4', '*', '9', '-'], 'priority example 1');
			});
		});
		expressionEvaluator.refreshConfiguration(function(err) {
			var expression = ['8', '-', '4', '*', '9'];
			expressionEvaluator.convertToPostFix(expression, function(err, output) {
				assert.deepEqual(output, ['8', '4', '9', '*', '-'], 'priority example 2');
			});
		});
		expressionEvaluator.refreshConfiguration(function(err) {
			var expression = ['3', '*', '8', '-', '4', '*', '9'];
			expressionEvaluator.convertToPostFix(expression, function(err, output) {
				assert.deepEqual(output, ['3', '8', '*', '4', '9', '*', '-'], 'priority example 3');
			});
		});
		expressionEvaluator.refreshConfiguration(function(err) {
			var expression = ['3', '*', '83'];
			expressionEvaluator.convertToPostFix(expression, function(err, output) {
				assert.deepEqual(output, ['3', '83', '*'], 'priority example 3');
			});
		});
	});
	it('Evaluate Expression', function() {
		expressionEvaluator.refreshConfiguration(function(err) {
			var expression = ['9', '+', '4'];
			expressionEvaluator.evaluateExpression(expression, function(err, output) {
				assert.strictEqual(output, 13, 'reg example 1');
			});
		});
		expressionEvaluator.refreshConfiguration(function(err) {
			var expression = ['9', '-', '4'];
			expressionEvaluator.evaluateExpression(expression, function(err, output) {
				assert.strictEqual(output, 5, 'reg example 2');
			});
		});
		
		expressionEvaluator.refreshConfiguration(function(err) {
			var expression = ['4', '-', '9'];
			expressionEvaluator.evaluateExpression(expression, function(err, output) {
				assert.strictEqual(output, -5, 'reg example 3');
			});
		});
		expressionEvaluator.refreshConfiguration(function(err) {
			var expression = ['9', '*', '4'];
			expressionEvaluator.evaluateExpression(expression, function(err, output) {
				assert.strictEqual(output, 36, 'reg example 4');
			});
		});
		expressionEvaluator.refreshConfiguration(function(err) {
			var expression = ['9', '/', '4'];
			expressionEvaluator.evaluateExpression(expression, function(err, output) {
				assert.strictEqual(output, 2.25, 'reg example 5');
			});
		});
		
		expressionEvaluator.refreshConfiguration(function(err) {
			var expression = ['8', '*', '9', '+', '4'];
			expressionEvaluator.evaluateExpression(expression, function(err, output) {
				assert.ok(err, 'error test 1');
			});
		});
		expressionEvaluator.refreshConfiguration(function(err) {
			var expression = ['8', '+', '9', '*', '4'];
			expressionEvaluator.evaluateExpression(expression, function(err, output) {
				assert.ok(err, 'error test 2');
			});
		});
		
		
		expressionEvaluator.refreshConfiguration(function(err) {
			expressionEvaluator.configuration.config_public.max_operators = 20;
			expressionEvaluator.configuration.config_public.max_numbers = 20;
			var expression = ['8', '*', '9', '+', '4'];
			expressionEvaluator.evaluateExpression(expression, function(err, output) {
				assert.strictEqual(output, 76, 'high priority 1');
			});
		});
		expressionEvaluator.refreshConfiguration(function(err) {
			expressionEvaluator.configuration.config_public.max_operators = 20;
			expressionEvaluator.configuration.config_public.max_numbers = 20;
			var expression = ['8', '+', '9', '*', '4'];
			expressionEvaluator.evaluateExpression(expression, function(err, output) {
				assert.strictEqual(output, 44, 'reg example 1');
			});
		});
		
		
	});
});