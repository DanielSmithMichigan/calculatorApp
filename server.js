var express = require('express');
var app = express();
app.use(express.logger('dev'));
app.use(express.static(__dirname + '/public'));
app.get('/', function (req, res) {
	res.render('index',	{title : req.originalUrl});
})
app.listen(3000);