import express from 'express'
import httpModule from 'http'
import path from 'path'
import morgan from 'morgan'
import socketIo from 'socket.io'
import mongo from 'mongodb'


const app = express()
const http = httpModule.createServer(app)
const io = socketIo(http)
const mongodb = mongo.MongoClient
const mongoUrl = 'mongodb://nate:12345@ds145158.mlab.com:45158/socket-io-chat'

app.use(morgan('dev'))
app.use(express.static(path.join(__dirname, '..', 'public')))
app.set('view engine', 'pug')
app.set('views', path.join(__dirname, '..', 'views'))

http.listen(process.env.PORT || 3000, () => {
	console.log('Server started on port 3000')
})

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
				console.log(`Success: ${message.message} added to db`)
			})
		})

	})

})

