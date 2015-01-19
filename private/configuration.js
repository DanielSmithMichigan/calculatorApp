/*
 * @Author DSmith
 * Configuration is responsible for retrieving the configuration from the database, sorting it into public (viewable on client side) and private configuration
 * and making that data useable
 */
 
var configuration = function(dbHandler) {
	this.dbHandler = dbHandler;
	this.config_public = {};
	this.config_private = {};
}

/*
 * @Author DSmith
 * Retrieve configuration from database. If a filter is passed in, only get the values requested through the filter
 */
 
configuration.prototype.retrieveConfiguration = function(filters, callback) {
	this.dbHandler.findByFilter(filters, function(err, configurations) {
		if (err) {
			callback(err)
		} else {
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

module.exports = configuration;