const monk = require('monk')
const db = require('../../connection')
const table = db.get('internaciones')
const view = db.get('vInternaciones')
var router = require('express').Router()

router.use('/nuevo', require('./nuevo'))

module.exports = router
