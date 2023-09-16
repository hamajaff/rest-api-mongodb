require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const danceClasses = require('./routes/danceClasses')
const participants = require('./routes/participants')

const app = express()

const configureExpressApp = () => {
	app.use(express.json())

	app.use((req, _res, next) => {
		console.log(`Processing ${req.method} request to ${req.path}`)
		next()
	})

	app.use('/api/v1/danceclasses', danceClasses)
	app.use('/api/v1/participants', participants)
}

const connectToDatabase = async () => {
	try {
		mongoose.set('strictQuery', false)
		const conn = await mongoose.connect(process.env.MONGO_URI)
		console.log(`MongoDB connected: ${conn.connection.host}`)
	} catch (error) {
		console.error('Failed to connect to MongoDB:', error)
	}
}

const startServer = (port) => {
	app.listen(port, () => {
		console.log(`Server is listening on http://localhost:${port}`)
	})
}

const run = async () => {
	configureExpressApp()
	await connectToDatabase()
	startServer(5000)
}

run()
