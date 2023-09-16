const mongoose = require('mongoose')

const participantSchema = new mongoose.Schema({
	namn: {
		type: String,
		required: true,
	},

	email: {
		type: String,
		required: true,
	},

	role: {
		type: String,

		required: true,
	},

	betalningsstatus: {
		type: String,
	},

	danceClass: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'DanceClass',
	},
})

module.exports = mongoose.model('Participant', participantSchema)
