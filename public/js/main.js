(function () {
	var socket = io();

	$('form').submit(() => {
		socket.emit('chat message', $('#message').val());
		$('#message').val('');
		return false;
	});

	socket.on('chat message', msg => {
		var sound = document.getElementById("audio");
		$('#messages').append($('<li>').text(msg.message));
		sound.play();
	});

})()
