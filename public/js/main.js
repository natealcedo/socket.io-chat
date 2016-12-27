'use strict';

(function () {
	$('.input').hide()
	let login = true
	if($('#message').val().length === 0){
		login = false
	}
	var payload = $.get('/messages')
		.done(function (data) {
			console.log(data)
		})
		.fail(function () {
			console.log('Failure to connect to db')
		})

	var socket = io()

	$('form').submit(e => {
		if(!login){
			e.preventDefault()
			return 
		}
		socket.emit('chat message', $('#message').val())
		$('#message').val('')
		return false
	})

	socket.on('chat message', msg => {
		var sound = document.getElementById('audio')
		$('#messages').append($('<li>').text(msg.message))
		sound.play()
	})

})()
