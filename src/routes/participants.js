const express = require('express')

const router = express.Router()

const { updateParticipant } = require('../controllers/participantControllor')

router.put('/:participantId', updateParticipant)

module.exports = router
