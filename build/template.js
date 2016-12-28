'use strict';

var express = require('express');
var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
var path = require('path');
var morgan = require('morgan');
var mongodb = require('mongodb').MongoClient;
var mongoUrl = 'mongodb://nate:12345@ds145158.mlab.com:45158/socket-io-chat';

app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

http.listen(process.env.PORT || 3000, function () {
	console.log('Server started on port 3000');
});

app.get('/', function (req, res) {
	res.render('index');
});

mongodb.connect(mongoUrl, function (err, db) {
	if (err) throw err;
	var messages = db.collection('messages');

	app.get('/messages', function (req, res) {
		messages.find().toArray(function (err, data) {
			if (err) throw err;
			res.json(data);
		});
	});

	io.on('connection', function (socket) {
		console.log('user connected!');
		socket.on('chat message', function (msg) {
			var message = {
				message: msg,
				time: new Date().toString().split(' ')[4]
			};
			io.emit('chat message', message);
			messages.insert(message, function (err) {
				if (err) throw err;
				console.log('Success: ' + message.message + ' added to db');
			});
		});
	});
});