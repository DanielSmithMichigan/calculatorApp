/* My idea for general is that it just holds a bunch of utility functions */

var general = function () {
}

general.prototype.is_numeric = function(n) {
	return(!isNaN(parseFloat(n)) && isFinite(n));
}

module.exports = general;