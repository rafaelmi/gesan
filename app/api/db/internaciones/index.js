const monk = require('monk')
const db = require('../connection')
const table = db.get('internaciones')
const view = db.get('vInternaciones')
var router = require('express').Router()

router.post('/get', ({ body }, { locals }, next) => {
  let args = Object.assign({}, body)
  if (body._id) args._id = parseInt(body._id, 10)
  view.find(args, {castIds: false})
  .then(data => {
    Object.assign(locals, { data })
    next()
  }).catch(next)
})

router.post('/create', ({ body }, res, next) => {
  let args = Object.assign({}, body)
  const current = Date.now()
  args.fecha = current
  args.inicio = current
  args.modificado = current
  args.estado = 'ACTIVO'
  view.findOne({
    sala: args.sala,
    estado: 'ACTIVO'
  }).then(data => {
    if (data) throw 454
    table.insert(args).then(data => {
      Object.assign(res.locals, { data })
      next()
    }).catch(next)
  }).catch(next)
})

router.use('/servicios', require('./servicios'))
router.use('/evolucion', require('./evolucion'))
router.use('/indicaciones', require('./indicaciones'))
router.use('/enfermeria', require('./enfermeria'))

module.exports = router
