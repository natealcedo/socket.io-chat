const express = require('express')
const app = require('express')()
const http = require('http').createServer(app)
const io = require('socket.io')(http)
const path = require('path')
const morgan = require('morgan')
const mongodb = require('mongodb').MongoClient
const mongoUrl = 'mongodb://nate:12345@ds145158.mlab.com:45158/socket-io-chat'

app.use(morgan('dev'))
app.use(express.static(path.join(__dirname, 'public')))
app.set('view engine', 'pug')
app.set('views', path.join(__dirname, 'views'))

app.get('/', (req, res) => {
	res.render('index')
})

mongodb.connect(mongoUrl, (err, db) => {
	if (err) throw err
	let messages = db.collection('messages')

	app.get('/messages', (req, res) => {
		messages.find().toArray((err, data) => {
			if (err) throw err
			res.json(data)
		})
	})

	io.on('connection', socket => {
		console.log('user connected!')
		socket.on('chat message', msg => {
			let message = {
				message: msg,
				time: new Date().toString().split(' ')[4]
			}
			io.emit('chat message', message)
			messages.insert(message, (err) => {
				if (err) throw err
				console.log('Success: Data added to db')
			})
		})

	})

})



http.listen(process.env.PORT || 3000, () => {
	console.log('Server started on port 3000')
})
