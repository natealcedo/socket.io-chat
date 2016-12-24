const express = require('express')
const app = express()
const path = require('path')
const morgan = require('morgan')

app.use(morgan('dev'))
app.use(express.static(path.join(__dirname, 'public')))
app.set('view engine', 'pug')
app.set('views', path.join(__dirname, 'views'))


app.get('/', (req, res) => {
	res.render('index')
})

app.listen(3000)