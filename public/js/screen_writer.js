function screenWriter() {
	this.symbolStack = [];
}
screenWriter.prototype.addToStack = function(item) {
	var pushToStack;
	var topOfStack = this.symbolStack.pop();
	if (typeof topOfStack === 'undefined') {
		pushToStack = item;
	} else {
		if (general.is_numerical(topOfStack) && general.is_numerical(item)) {
			if (topOfStack === item === '.') {
				pushToStack = item;
			} else {
				pushToStack = "" + topOfStack + item;
			}
		} else if (general.is_operator(topOfStack)) {
			if (!general.is_operator(item)) {
				this.symbolStack.push(topOfStack);
			}
			pushToStack = item;
		} else {
			this.symbolStack.push(topOfStack);
			pushToStack = item;
		}
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