/*
 * @Author DSmith
 * screenWriter is responsible for managing the display of the calculator screen
 */
 
function screenWriter() {
	this.symbolStack = [];
	this.total_numbers = 0;
	this.total_operators = 0;
}

/*
 * @Author DSmith
 * emptyStack will clear all "backend" data responsible for calculator screen
 */
 
screenWriter.prototype.emptyStack = function() {
	this.symbolStack = [];
	this.total_numbers = 0;
	this.total_operators = 0;
}

/*
 * @Author DSmith
 * addToStack will add a new item to the calculator screen, while also validating that it is acceptable to add
 */
 
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

/*
 * @Author DSmith
 * addOperator will add a new operator to the calculator screen, while also validating that it is acceptable to add
 */
 
screenWriter.prototype.addOperator = function(topOfStack, item) {
	if (general.is_operator(topOfStack)) {
		this.symbolStack.push(item);
	} else if (general.is_numeric(topOfStack)) {
		if (this.total_operators < general.max_operators) {
			if (general.last_character_is_decimal(topOfStack)) {
				topOfStack = topOfStack.substring(0, topOfStack.length - 1);
			}
			this.symbolStack.push(topOfStack);
			this.symbolStack.push(item);
			this.total_operators++;
		} else {
			this.symbolStack.push(topOfStack);
		}
	}
}

/*
 * @Author DSmith
 * addDecimalPoint will add a new decimal point to the calculator screen, while also validating that it is acceptable to add
 */
 
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

/*
 * @Author DSmith
 * addDigit will add a new digit to the calculator screen, while also validating that it is acceptable to add
 */
 
screenWriter.prototype.addDigit = function(topOfStack, item) {
	if (general.is_operator(topOfStack)) {
		if (this.total_numbers < general.max_numbers) {
			this.symbolStack.push(topOfStack);
			this.symbolStack.push(item);
			this.total_numbers++;
		} else {
			this.symbolStack.push(topOfStack);
		}
	} else if (general.is_numeric(topOfStack)) {
		if (general.equals_zero(topOfStack) && !general.string_contains_decimal_point(topOfStack)) {
			item = "" + item;
		} else {
			item = "" + topOfStack + item;
		}
		this.symbolStack.push(item);
	} else if (typeof topOfStack === 'undefined') {
		if (this.total_numbers < general.max_numbers) {
			this.symbolStack.push(item);
			this.total_numbers++;
		}
	}
}

/*
 * @Author DSmith
 * getDisplay will convert the symbol stack to a string which can be put onto the calculator screen
 */
 
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