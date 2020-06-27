const monk = require('monk')
const db = require('../connection')
const response = require('../response')
const table = db.get('pacientes')
const view = db.get('vPacientes')
var router = require('express').Router()

router.post('/create', ({ body }, res, next) => {
  let args = Object.assign({}, body)
  args._id = args.cedula
  delete args.cedula
  args.fecha = Date.now()
  args.modificado = args.fecha
  table.insert(args, {castIds: false})
  .then(data => {
    Object.assign(body, data)
    next()
  }).catch(next)
})

router.post('/get', (req, res, next) => {
  let args = Object.assign({}, req.body)
  table.find(args, {castIds: false})
  .then(data => {
    req.body = data
    next()
  }).catch(next)
})

module.exports = router
