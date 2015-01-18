var dbHandler = require('./private/dbHandler.js');
var configuration = require('./private/configuration.js');
var expressionEvaluator = require('./private/expressionEvaluator.js');
var requestHandler = require('./private/requestHandler.js');
var general = require('./private/general.js');

dbHandler = new dbHandler(function () {
	configuration.updateConfiguration({}, function(err, config) {
	});
});

general = new general();
configuration = new configuration(dbHandler);
expressionEvaluator = new expressionEvaluator(configuration, general);
requestHandler = new requestHandler(expressionEvaluator);

// Handler Functions
var express = require('express');
var app = express();
app.use(express.logger('dev'));
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(express.json());
app.post('/', function (req, res) {
	requestHandler.handleRequest(req.body, function(err, data) {
		if (err) {
			console.log(err);
		} else {
			res.send(data);
		}
	});
});
app.get('/', function (req, res) {
	res.render('index',	{title : 'The DanSmith Calculator App'});
});
app.get('/test', function (req, res) {
	res.render('test',	{title : 'The DanSmith Calculator App Tester'});
});
app.listen(3000);