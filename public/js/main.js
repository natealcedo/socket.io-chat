(function () {

	var payload = $.get("/messages")
		.done(function (data) {
			console.log(data)
		})
		.fail(function () {
			alert("error");
		})

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
