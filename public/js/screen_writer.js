function screenWriter() {
	this.symbolStack = [];
}
screenWriter.prototype.emptyStack = function() {
	this.symbolStack = [];
}
screenWriter.prototype.addToStack = function(item) {
	item = "" + item; // symbolStack can only contain strings
	var topOfStack = this.symbolStack.pop();
	if (general.is_numeric(item)) {
		this.addDigit(topOfStack, item);
	} else if (general.is_decimal_point(item)) {
		this.addDecimalPoint(topOfStack, item);
	} else if (general.is_operator(item)) {
		this.addOperator(topOfStack, item);
	}
}
screenWriter.prototype.addOperator = function(topOfStack, item) {
	if (general.is_operator(topOfStack)) {
		this.symbolStack.push(item);
	} else if (general.is_numeric(topOfStack)) {
		if (general.last_character_is_decimal(topOfStack)) {
			topOfStack = topOfStack.substring(0, topOfStack.length - 1);
		}
		this.symbolStack.push(topOfStack);
		this.symbolStack.push(item);
	}
}
screenWriter.prototype.addDecimalPoint = function(topOfStack, item) {
	if (general.is_operator(topOfStack)) {
		this.symbolStack.push(topOfStack);
		item = "" + "0" + item;
		this.symbolStack.push(item);
	} else if (general.is_numeric(topOfStack)) {
		if (!general.string_contains_decimal_point(topOfStack)) {
			item = "" + topOfStack + item;
			this.symbolStack.push(item);
		} else {
			this.symbolStack.push(topOfStack);
		}
	} else if (typeof topOfStack === 'undefined') {
		item = "" + "0" + item;
		this.symbolStack.push(item);
	}
}
screenWriter.prototype.addDigit = function(topOfStack, item) {
	if (general.is_operator(topOfStack)) {
		this.symbolStack.push(topOfStack);
		this.symbolStack.push(item);
	} else if (general.is_numeric(topOfStack)) {
		if (general.equals_zero(topOfStack) && !general.string_contains_decimal_point(topOfStack)) {
			item = "" + item;
		} else {
			item = "" + topOfStack + item;
		}
		this.symbolStack.push(item);
	} else if (typeof topOfStack === 'undefined') {
		this.symbolStack.push(item);
	}
}
screenWriter.prototype.getDisplay = function() {
	var output = '';
	var spacer = ' ';
	var previous_type = false;
	var current_type = false;
	for(var i = 0; i < this.symbolStack.length; i++) {
		current_type = general.is_operator(this.symbolStack[i])?'operator':'numeric';
		if (current_type !== previous_type && previous_type !== false) {
			output += spacer;
		}
		output += this.symbolStack[i];
		previous_type = current_type;
	}
	return output;
}