const monk = require('monk')
const db = require('../connection')
const response = require('../response')
const router = require('express').Router()

const table = db.get('urgencias')
const view = db.get('vUrgencias')

router.post('/create', ({ body }, res, next) => {
  let args = Object.assign({}, body)
  const current = Date.now()
  args.fecha = current
  args.inicio = current
  args.modificado = current
  args.estado = 'ACTIVO'
  view.findOne({
    cama: args.cama,
    estado: {
      $in: ['ACTIVO', 'OBSERVACION']
    }
  }).then(data => {
    if (data) throw 454
    table.insert(args)
    .then(data => {
      Object.assign(res.locals, { data })
      next()
    }).catch(next)
  }).catch(next)
})

router.post('/get', ({ body }, res, next) => {
  let args = Object.assign({}, body)
  view.find(args)
  .then(data => {
    Object.assign(res.locals, { data })
    next()
  })
})

router.post('/update', ({ body }, res, next) => {
  let args = Object.assign({}, body)
  const id = monk.id(args._id)
  const current = Date.now()
  delete args._id
  args.modificado = current
  view.find({
    estado: {
      $in: ['ACTIVO', 'OBSERVACION']
    }
  }).then(data => {
    const cama = data.find(el => el._id.toString() === id.toString())
    if (args.estado && !cama) throw 400
    switch (args.estado) {
      case 'OBSERVACION':
        if (cama.cama === 'observacion') throw 400
        if (data.find(el => el.cama === 'observacion')) throw 454
        if (!args.observacion) args.observacion = {}
        args.observacion.inicio = current
        args.cama = 'observacion'
        break
      case 'FINALIZADO':
        if (cama.estado === 'FINALIZADO') throw 400
        if (args.observacion) args.observacion.fin = current
        args.fin = current
        break
      default:
    }
    table.findOneAndUpdate({ _id: id }, { $set: args })
    .then(data => {
      Object.assign(res.locals, { data })
      next()
    }).catch(next)
  }).catch(next)
})

router.post('/addService', ({ body, session }, res, next) => {
  let args = Object.assign({}, body)
  table.findOneAndUpdate(
    { _id: monk.id(args._id) },
    {
      $set: { modificado: new Date() },
      $push: { servicios: args.servicio }
    }
  ).then(data => {
    Object.assign(res.locals, { data })
  next()
  })
})

module.exports = router
