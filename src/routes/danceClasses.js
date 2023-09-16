const express = require('express')

const router = express.Router()

const {
	getAllClasses,
	getActiveClasses,
	addParticipantToClass,
	deleteParticipantFromClass,
} = require('../controllers/danceClassController')

router.get('/', getAllClasses)
router.get('/active', getActiveClasses)
router.post('/:danceClassId/participants', addParticipantToClass)
router.delete('/:danceClassId/participants/:participantId', deleteParticipantFromClass)

module.exports = router
