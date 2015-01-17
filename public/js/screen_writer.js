function screenWriter() {
	this.symbolStack = [];
}
screenWriter.prototype.emptyStack = function() {
	this.symbolStack = [];
}
screenWriter.prototype.addToStack = function(item) {
	var pushToStack;
	var topOfStack = this.symbolStack.pop();
	var repush = false;
	if (typeof topOfStack === 'undefined') {
		if (general.is_operator(item)) {
			// can't push operator without number to the left in infix.
		} else if (general.is_decimal_point(item)) {
			pushToStack = "" + "0" + item;
		} else {
			pushToStack = item;
		}
	} else {
		// possibilities: 
		// top of stack can be a number or operator. (decimal point by itself will have 0 prepended, thus becoming a number)
		// new on stack can be number, operator or decimal point.
		
		// top of stack is number
		if (general.is_numeric(topOfStack)) {
			if (general.is_numeric(item)) {
				// new stack item is number, concat to number on top of stack
				pushToStack = "" + topOfStack + item;
			} else if (general.is_decimal_point(item)) {
				// new stack item is decimal point
				if (!general.string_contains_decimal_point(topOfStack)) {
					// make sure there isn't already a decimal point in the number we are adding the decimal point to
					pushToStack = "" + topOfStack + item;
				} else {
					pushToStack = topOfStack;
				}
			} else {
				// new stack item is operator
				repush = true;
				if (general.last_character_is_decimal(topOfStack)) {
					topOfStack = topOfStack.substring(0, topOfStack.length - 1);
				}
				pushToStack = item;
			}
		} else if (general.is_operator(topOfStack)) {
			// top of stack is operator
			if (general.is_operator(item)) {
				// new on stack is operator. Just replace top of stack.
				pushToStack = item;
			} else if (general.is_decimal_point(item)) {
				repush = true;
				pushToStack = "" + "0" + item;
			} else if (general.is_numeric(item)) {
				repush = true;
				pushToStack = item;
			}
		}
	}
	if (repush === true) {
		this.symbolStack.push(topOfStack);
	}
	this.symbolStack.push(pushToStack);
}
screenWriter.prototype.getDisplay = function() {
	var output = '';
	var spacer = '  ';
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