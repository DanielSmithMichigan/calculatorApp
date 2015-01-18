var db = require('mongodb').Db;
var Connection = require('mongodb').Connection;
var Server = require('mongodb').Server;
var BSON = require('mongodb').BSON;
var ObjectID = require('mongodb').ObjectID;

var dbHandler = function (callback) {
	this.db=new db('calculator-db', new Server('localhost', 27017, {}, {}), {w: 1, safe: false});
	this.db.open(callback);
}

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

dbHandler.prototype.findOneByFilter = function(filters, callback) {
	this.getCollection(function(err, collection) {
		if (err) {
			callback(err);
		} else {
			collection.findOne(filters, function(err, items) {
				if (err) {
					callback(err);
				} else {
					callback(err, items);
				}
			});
		}
	});
};

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

module.exports = dbHandler;