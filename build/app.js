'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _http = require('http');

var _http2 = _interopRequireDefault(_http);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _morgan = require('morgan');

var _morgan2 = _interopRequireDefault(_morgan);

var _socket = require('socket.io');

var _socket2 = _interopRequireDefault(_socket);

var _mongodb = require('mongodb');

var _mongodb2 = _interopRequireDefault(_mongodb);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var app = (0, _express2.default)();
var http = _http2.default.createServer(app);
var io = (0, _socket2.default)(http);
var mongodb = _mongodb2.default.MongoClient;
var mongoUrl = 'mongodb://nate:12345@ds145158.mlab.com:45158/socket-io-chat';

app.use((0, _morgan2.default)('dev'));
app.use(_express2.default.static(_path2.default.join(__dirname, '..', 'app/public')));
app.set('view engine', 'pug');
app.set('views', _path2.default.join(__dirname, '..', 'views'));

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
		messages.find().toArray(function (err, messages) {
			if (err) throw err;
			res.json(messages);
		});
	});

	io.on('connection', function (client) {

		var users = {};
		console.log('user connected!');

		client.on('join', function (name) {
			users[client.id] = name;
			client.broadcast.emit('update', name + ' has connected to the server');
			client.emit('update', 'you have connected to the server');
		});

		client.on('chat message', function (msg) {
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