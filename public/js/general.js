var general = {
	template_location: 'templates'
	,element_template_location: 'element_templates'
	,operators: ['+','-','/','*','(',')']
	,numbers: [0,1,2,3,4,5,6,7,8,9,'.']
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
	,is_numerical: function(item) {
		return(this.is_numeric(item) || item === '.');
	}
	,is_numeric: function(n) {
		return(!isNaN(parseFloat(n)) && isFinite(n));
	}
	,is_operator: function(item) {
		return (this.operators.indexOf(item) !== -1);
	}
}