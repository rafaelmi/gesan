const monk = require('monk')
const db = require('../../connection')
const table = db.get('internaciones')
const view = db.get('vInternaciones')
var router = require('express').Router()

router.post('/create', ({ body, session }, res, next) => {
  let args = Object.assign({}, body)
  const current = Date.now()
  table.findOneAndUpdate(
    { _id: monk.id(args._id) },
    {
      $set: { modificado: current },
      $push: { 'indicaciones.nuevo': args.nuevo }
    }
  ).then(data => {
    Object.assign(res.locals, { data })
    next()
  }).catch(next)
})

router.post('/save', ({ body, session }, res, next) => {
  let args = Object.assign({}, body)
  const current = Date.now()
  table.findOne(
    { _id: monk.id(args._id) },
    {
      indicaciones: 1
    }
  ).then(data => {
    const nuevo = {
      fecha: current,
      items: data.indicaciones.nuevo
    }
    table.findOneAndUpdate(
      { _id: monk.id(args._id) },
      {
        $set: { modificado: current, 'indicaciones.nuevo': [] },
        $push: { 'indicaciones.lista': nuevo }
      }
    ).then(data => {
      Object.assign(res.locals, { data })
      next()
    }).catch(next)
  }).catch(next)
})

router.post('/delete', ({ body, session }, res, next) => {
  let args = Object.assign({}, body)
  const current = Date.now()
  table.findOneAndUpdate(
    { _id: monk.id(args._id) },
    {
      $set: { modificado: current, 'indicaciones.nuevo': [] }
    }
  ).then(data => {
    Object.assign(res.locals, { data })
    next()
  }).catch(next)
})

module.exports = router
