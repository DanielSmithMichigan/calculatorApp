var general = {
	template_location: 'templates'
	,element_template_location: 'element_templates'
	,operators: ['+','-','/','*']
	,numbers: [0,1,2,3,4,5,6,7,8,9,'.']
	,commands: ['=','C']
	,get_template_url: function(tagname) {
		var new_tag_name = tagname.toLowerCase() + '.html';
		return([this.template_location, this.element_template_location, new_tag_name].join('/'));
	}
	,get_top: function(array) {
		var output;
		if (array.length > 0) {
			output = array[array.length - 1];
		} else {
			output = false;
		}
		return output;
	}
	,equals_zero: function(n) {
		return(n == 0);
	}
	,last_character_is_decimal: function(n) {
		return(("" + n).slice(-1) === '.');
	}
	,string_contains_decimal_point: function(n) {
		/* Will only work with strings, because, for example, 5.000 will be converted to 5 immediately once it's passed as a parameter  */
		return(n.split('.').length > 1);
	}
	,is_decimal_point: function(n) {
		return(n === '.');
	}
	,is_numeric: function(n) {
		return(!isNaN(parseFloat(n)) && isFinite(n));
	}
	,is_operator: function(item) {
		return (this.operators.indexOf(item) !== -1);
	}
}