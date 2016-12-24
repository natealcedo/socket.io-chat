const express = require('express')
const app = require('express')()
const http = require('http').createServer(app)
const io = require('socket.io')(http)
const path = require('path')
const morgan = require('morgan')

app.use(morgan('dev'))
app.use(express.static(path.join(__dirname, 'public')))
app.set('view engine', 'pug')
app.set('views', path.join(__dirname, 'views'))


app.get('/', (req, res) => {
	res.render('index')
})

io.on('connection', socket => {
	console.log('user connected!')
	socket.on('chat message', msg => {
		let message = `${msg} @ ${new Date().toString().split(' ')[4]}`
		io.emit('chat message', message)
	})
})

http.listen(process.env.PORT || 3000, () => {
	console.log('Server started on port 3000')
})