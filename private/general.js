var general = function () {
}

general.prototype.is_numeric = function(n) {
	return(!isNaN(parseFloat(n)) && isFinite(n));
}

module.exports = general;