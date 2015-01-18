var configuration = function(dbHandler) {
	this.dbHandler = dbHandler;
	this.config_public = {};
	this.config_private = {};
}

configuration.prototype.retrieveConfiguration = function(filters, callback) {
	this.dbHandler.findByFilter(filters, function(err, configurations) {
		if (err) callback(err)
		else {
			for(var i = 0; i < configurations.length; i++) {
				var curr_config = configurations[i];
				if (curr_config.private === true) {
					this.config_private[curr_config.name] = curr_config.value;
				} else {
					this.config_public[curr_config.name] = curr_config.value;
				}
			}
			callback(null);
		}
	}.bind(this));
}

configuration.prototype.updateConfiguration = function(filters, callback) {
	this.retrieveConfiguration.apply(this, [filters, function(err, config) {
		if (err) callback(err)
		else {
			for (var i in config) {
				this[i] = config[i];
			}
		}
	}]);
}

module.exports = configuration;