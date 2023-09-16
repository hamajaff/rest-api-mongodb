const { NotFoundError, BadRequestError } = require('../utils/errors')
const DanceClass = require('../models/danceClass')
const Participant = require('../models/participant')

const MAX_PARTICIPANTS = 20
const MAX_LEADERS = 10
const MAX_FOLLOWERS = 10

const getDanceClasses = async (active = false) => {
	const filter = active ? { active: true } : {}
	const classes = await DanceClass.find(filter).populate('participants')

	if (classes.length === 0) {
		throw new NotFoundError(active ? 'Finns inga aktiva klasser!' : 'Finns inga klasser!')
	}

	return classes
}

exports.getAllClasses = async (req, res, next) => {
	try {
		const danceClasses = await getDanceClasses()
		res.json({ data: danceClasses })
	} catch (error) {
		next(error)
	}
}

exports.getActiveClasses = async (req, res, next) => {
	try {
		const activeClasses = await getDanceClasses(true)
		res.json({ data: activeClasses })
	} catch (error) {
		next(error)
	}
}

const addParticipant = async (danceClassId, { namn, email, role }) => {
	const danceClass = await DanceClass.findById(danceClassId).populate('participants')

	if (!danceClass) {
		throw new NotFoundError('DanceClass not found')
	}

	const totalParticipants = danceClass.participants.length
	const totalLeaders = danceClass.participants.filter((participant) => participant.role === 'ledare').length
	const totalFollowers = danceClass.participants.filter((participant) => participant.role === 'följare').length

	if (totalParticipants >= MAX_PARTICIPANTS) {
		throw new BadRequestError('Klassen har redan max antal deltagare.')
	}

	if (role === 'ledare' && totalLeaders >= MAX_LEADERS) {
		throw new BadRequestError('Klassen har redan max antal ledare.')
	}

	if (role === 'följare' && totalFollowers >= MAX_FOLLOWERS) {
		throw new BadRequestError('Klassen har redan max antal följare.')
	}

	const participant = new Participant({
		namn,
		email,
		role,
		betalningsstatus: 'pending',
		danceClass: danceClass,
	})

	await participant.save()

	danceClass.participants.push(participant.id)
	await danceClass.save()

	return participant
}

exports.addParticipantToClass = async (req, res, next) => {
	try {
		const newParticipant = await addParticipant(req.params.danceClassId, req.body)
		res.send(newParticipant)
	} catch (error) {
		next(error)
	}
}

const deleteParticipant = async (danceClassId, participantId) => {
	const danceClass = await DanceClass.findById(danceClassId).populate('participants')
	const participant = await Participant.findById(participantId)

	if (!participant) {
		throw new NotFoundError(`Deltagare med id ${participantId} hittades inte`)
	}

	if (!danceClass) {
		throw new NotFoundError(`Dansklass för deltagare med id ${participantId} hittades inte`)
	}

	danceClass.participants = danceClass.participants.filter((part) => part.id !== participantId)
	await danceClass.save()

	// @ts-ignore
	await participant.remove()

	return `Deltagare med id ${participantId} har tagits bort från dansklassen med id ${danceClass._id}`
}

exports.deleteParticipantFromClass = async (req, res, next) => {
	try {
		const message = await deleteParticipant(req.params.danceClassId, req.params.participantId)
		res.send({ message })
	} catch (error) {
		next(error)
	}
}
