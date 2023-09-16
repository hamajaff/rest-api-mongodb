const { NotFoundError, BadRequestError } = require('../utils/errors')
const Participant = require('../models/participant')

const findParticipantById = async (participantId) => {
	const participant = await Participant.findById(participantId)
	if (!participant) {
		throw new NotFoundError('Deltagaren med den här id finns inte!')
	}
	return participant
}

const validateUpdateInputs = (email, betalningsstatus) => {
	if (!email || !betalningsstatus) {
		throw new BadRequestError('Ange betalningsstatuts')
	}
}

const updateParticipantDetails = async (participant, email, betalningsstatus) => {
	if (email) participant.email = email
	if (betalningsstatus) participant.betalningsstatus = betalningsstatus

	const updatedParticipant = await participant.save()
	return updatedParticipant
}

exports.updateParticipant = async (req, res, next) => {
	try {
		const { participantId } = req.params
		const { email, betalningsstatus } = req.body

		validateUpdateInputs(email, betalningsstatus)

		const participantToUpdate = await findParticipantById(participantId)

		const updatedParticipant = await updateParticipantDetails(participantToUpdate, email, betalningsstatus)

		res.status(200).json(updatedParticipant)
	} catch (error) {
		console.error(error)
		next(error)
	}
}
