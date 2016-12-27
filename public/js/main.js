'use strict';

(function () {
	// debugger

	var socket = io()

	$('.input').hide()

	let login = true
	$('#userName').attr('maxlength', '15')
	if ($('#message').val().length === 0) {
		login = false
	}

	$('form').submit(e => {
		if (!login) {
			e.preventDefault()
			return
		}
		var payload = $.get('/messages')
			.done(function (data) {
				console.log(data)
			})
			.fail(function () {
				console.log('Failure to connect to db')
			})

		socket.emit('chat message', $('#message').val())
		$('#message').val('')
		return false
	})

	$('#login').submit(() => {
		login = true
		$('#login').hide()
		$('.input').show()
		$('.nickName').html($('#userName').val())
		return 
	})

	socket.on('chat message', msg => {
		var sound = document.getElementById('audio')
		$('#messages').append($('<li>').text(msg.message))
		sound.play()
	})

})()
