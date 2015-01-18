var app = angular.module('calculator', []);
var calculatorScreen = new screenWriter();
app.directive('ae', function() {
	return {
		restrict: 'A',
		transclude: true,
		replace: true,
		templateUrl: function(element) {
			return general.get_template_url(element[0].tagName);
		}
	}
});
app.directive('nbutton', function () {
	return {
		restrict: 'E',
		template: function(element) {
			var inner_number = element.html();
			var html = '<div class="number_button inline_block_display" ng-click="addToScreen(\''+ inner_number +'\')">'+inner_number+'</div>';
			return html;
		}
	}
});

app.controller('calculatorController', ['$scope', '$http', function($scope, $http) {
	$scope.operators = general.operators;
	$scope.numbers = general.numbers;
	$scope.commands = general.commands;
	$scope.calculatorText = '';
	$scope.addToScreen = function(buttonContent) {
		calculatorScreen.addToStack(buttonContent);
		$scope.calculatorText = calculatorScreen.getDisplay();
	};
	$scope.performCommand = function(buttonContent) {
		if (buttonContent === 'C') {
			calculatorScreen.emptyStack();
			$scope.calculatorText = calculatorScreen.getDisplay();
		} else if (buttonContent === '=') {
			var post_obj = {};
			post_obj.action = 'performCalculation';
			post_obj.symbolStack = calculatorScreen.symbolStack;
			$http.post('/', post_obj).
			success(function(data, status, headers, config) {
				$scope.calculatorText = 'Result: ' + data.expression_result;
				calculatorScreen.emptyStack();
			}).
			error(function(data, status, headers, config) {
				$scope.calculatorText = 'Result: ERR';
			});
		}
	};
}]);