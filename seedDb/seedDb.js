require('dotenv').config()
const mongoose = require('mongoose')
const DanceClass = require('../src/models/danceClass')
// @ts-ignore
const springTerm2023MockData = require('./mockdata/springTerm2023.json')
// @ts-ignore
const fallTermMock2023Data = require('./mockdata/fallTerm2023.json')

const seedDanceClassDb = async (connectionString) => {
	let conn
	try {
		mongoose.set('strictQuery', false)
		conn = await mongoose.connect(connectionString)

		await DanceClass.deleteMany()

		await DanceClass.create(springTerm2023MockData)
		await DanceClass.create(fallTermMock2023Data)

		console.log('Database successfully populated with test data')

		console.log(springTerm2023MockData)
		console.log(fallTermMock2023Data)
	} catch (error) {
		console.error(error)
	} finally {
		if (conn) conn.disconnect()
		process.exit(0)
	}
}

seedDanceClassDb(process.env.MONGO_URI)
