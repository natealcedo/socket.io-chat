'use strict';

(function () {

	var app = document.getElementById('app');
	var socket = io();
	// .connect('http://localhost:3000')

	$('.input').hide();

	var login = true;
	$('#userName').attr('maxlength', '15');
	if ($('#message').val().length === 0) {
		login = false;
	}

	$('form').submit(function (e) {
		if (!login) {
			e.preventDefault();
			return;
		}
		var payload = $.get('/messages').done(function (data) {
			console.log(data);
		}).fail(function () {
			console.log('Failure to connect to db');
		});

		socket.emit('chat message', $('#message').val());
		$('#message').val('');
		return false;
	});

	$('#login').submit(function () {
		login = true;
		$('#login').hide();
		$('.input').show();
		$('.nickName').html('Your screen name: ' + $('#userName').val());
		socket.emit('join', $('#userName').val());
	});

	socket.on('chat message', function (msg) {
		var sound = document.getElementById('audio');
		$('#messages').append($('<li>').text(msg.message));
		sound.play();
	});

	socket.on('update', function (user) {
		$('#messages').append($('<li>' + user + '</li>'));
	});
})();