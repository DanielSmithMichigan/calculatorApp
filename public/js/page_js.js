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

app.controller('calculatorController', ['$scope', function($scope) {
	$scope.operators = general.operators;
	$scope.numbers = general.numbers;
	$scope.calculatorText = '';
	$scope.addToScreen = function(buttonContent) {
		calculatorScreen.addToStack(buttonContent);
		$scope.calculatorText = calculatorScreen.getDisplay();
	};
}]);
/*
var number_displayer = function() {
	this.internal_text = '';
}
number_displayer.prototype.addText(text) {
	this.internal_text += text;
}*/