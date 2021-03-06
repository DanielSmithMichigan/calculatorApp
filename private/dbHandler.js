/*
 * @Author DSmith
 * dbHandler is responsible for making calls to the database
 */
 
var db = require('mongodb').Db;
var Server = require('mongodb').Server;

var dbHandler = function (callback) {
	this.db=new db('calculator-db', new Server('localhost', 27017, {}, {}), {w: 1, safe: false});
	this.db.open(callback);
}

/*
 * @Author DSmith
 * getCollection will attempt to retrieve a collection from the database. If the data isn't retrieved (because the db is still connecting)
 * getCollection will try a max of 5 times to retrieve the data.
 */
 
dbHandler.prototype.getCollection = function(callback, retry) {
	if (!retry) retry = 0;
	if (this.status === 'connecting') {
		if (retry < 5) {
			console.log('retry' + retry);
			setTimeout(function() {
				this.getCollection(callback, retry + 1);
			}, 1000).bind(this);
		} else {
			console.log('too many retries');
		}
	} else {
		var collection_name = 'calculator_app';
		this.db.collection(collection_name, function(error, article_collection) {
			if (error) {
				callback(error);
			} else {
				callback(null, article_collection);
			}
		});
	}
};

/*
 * @Author DSmith
 * findByFilter will accept a filter and retrieve all objects from the database that match the filter
 */
 
dbHandler.prototype.findByFilter = function(filters, callback) {
	this.getCollection(function(err, collection) {
		if (err) {
			callback(err);
		} else {
			collection.find(filters).toArray(function(err, items) {
				if (err) {
					callback(err);
				} else {
					callback(err, items);
				}
			});
		}
	});
};

dbHandler.prototype.installDb = function() {
	this.db.createCollection('calculator-db', function() {});
	var doc = {
	  "type" : "config",
	  "name" : "commands",
	  "value" : ["=", "C"],
	  "refreshOnCalc" : true
	};
	this.addDocument(doc);
	var doc = 
	{
	  "type" : "config",
	  "name" : "numbers",
	  "value" : [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, "."],
	  "expression" : true,
	  "refreshOnCalc" : true
	};
	this.addDocument(doc);
	var doc = 
	{
	  "type" : "config",
	  "name" : "operators",
	  "value" : ["+", "-", "/", "*"],
	  "expression" : true,
	  "refreshOnCalc" : true
	};
	this.addDocument(doc);
	var doc = 
	{
	  "type" : "config",
	  "name" : "operator_priority",
	  "value" : {
		"-" : 0,
		"+" : 0,
		"/" : 1,
		"*" : 1,
		"(neg)" : 2
	  },
	  "refreshOnCalc" : true
	}
;
	this.addDocument(doc);
	var doc = 
	{
	  "type" : "config",
	  "name" : "title",
	  "value" : "Dans Calculator App"
	};
	this.addDocument(doc);
	var doc = 
	{
	  "type" : "config",
	  "name" : "max_numbers",
	  "value" : 2
	};
	this.addDocument(doc);
	var doc = 
	{
	  "type" : "config",
	  "name" : "max_operators",
	  "value" : 1
	};
	this.addDocument(doc);
};

dbHandler.prototype.addDocument = function(document) {
	this.getCollection(function(err, collection) {
		if (err) {
			callback(err);
		} else {
			collection.insert(document, function(){});
		}
	});
};

module.exports = dbHandler;