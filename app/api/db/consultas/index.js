const monk = require('monk')
const db = monk('localhost/sanasur')
const response = require('../response')

const consultas = db.get('consultas')
const counters = db.get('counters')

module.exports = ({ io }) => {
  const router = require('express').Router()

  router.post('/create', ({ body }, res, next) => {
    let args = Object.assign({}, body)
    args.fecha = Date.now() // Devolver si es el caso (new Date())
    args.modificado = args.fecha
    args.estado = "EN ESPERA"
    consultas.insert(args)
    .then(data => {
      Object.assign(body, data)
      io.of('/consultas').emit('update', [ data ])
      // res.json(response(200))
      next()
    }).catch(next)
  })

  router.post('/get', ({ body, session }, res, next) => {
    let args = Object.assign({}, body)
    consultas.find(args)
    .then(data => {
      io.of('/consultas').to('/consultas#' + session.sid).emit('update', data)
      next()
      // res.json(response(200))
    })
  })

  router.post('/update', ({ body, session }, res, next) => {
    let args = Object.assign({}, body)
    const id = monk.id(args._id)
    delete args._id
    args.modificado = new Date();
    consultas.findOneAndUpdate({ _id: id }, { $set: args })
    .then(data => {
      io.of('/consultas').emit('update', [ data ])
      next()
      // res.json(response(200))
    })
  })

  router.post('/addService', ({ body, session }, res, next) => {
    let args = Object.assign({}, body)
    consultas.findOneAndUpdate(
      { _id: monk.id(args._id) },
      {
        $set: { modificado: new Date() },
        $push: { servicios: args.servicio }
      }
    ).then(data => {
      io.of('/consultas').emit('update', [ data ])
      next()
      // res.json(response(200))
    })
  })

  return router
}
