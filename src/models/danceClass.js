const mongoose = require('mongoose')

const danceClassSchema = new mongoose.Schema({
	namn: {
		type: String,
		required: true,
	},

	dansstil: {
		type: String,
	},

	start: {
		type: String,
	},

	slutar: {
		type: String,
	},

	tid: {
		type: String,
	},

	klasstidIMinuter: {
		type: Number,
	},

	pris: {
		type: Number,
	},

	klassLedare: {
		type: [String],
	},

	active: {
		type: Boolean,
	},

	participants: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Participant',
		},
	],

	maxParticipants: {
		type: Number,
		default: 20,
	},
})

module.exports = mongoose.model('DanceClass', danceClassSchema)
