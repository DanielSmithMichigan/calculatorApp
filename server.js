// include classes
var dbHandler = require('./private/dbHandler.js');
var configuration = require('./private/configuration.js');
var expressionEvaluator = require('./private/expressionEvaluator.js');
var requestHandler = require('./private/requestHandler.js');
var general = require('./private/general.js');

// start database connection and get configuration
dbHandler = new dbHandler(function () {
	configuration.retrieveConfiguration({}, function(err) {
	});
});

// instantiate classes
general = new general();
configuration = new configuration(dbHandler);
expressionEvaluator = new expressionEvaluator(configuration, general);
requestHandler = new requestHandler(expressionEvaluator);

// configure server
var express = require('express');
var app = express();
app.use(express.logger('dev'));
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(express.json());

// request handling
app.post('/', function (req, res) {
	// pass post requests to requestHandler
	requestHandler.handleRequest(req.body, configuration, function(err, data) {
		if (err) {
			console.log(err);
			if (data) {
				res.send(data);
			}
		} else {
			res.send(data);
		}
	});
});
app.get('/', function (req, res) {
	// get front end configuration, and build index view
	configuration.retrieveConfiguration({}, function(err) {
		res.render('index',	{'configuration': configuration.config_public});
	});
});
app.get('/test', function (req, res) {
	// get front end configuration and build test view
	configuration.retrieveConfiguration({}, function(err) {
		res.render('test', {'configuration': configuration.config_public});
	});
});

// start listening
app.listen(3000);