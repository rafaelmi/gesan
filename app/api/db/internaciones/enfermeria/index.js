const monk = require('monk')
const db = require('../../connection')
const table = db.get('internaciones')
const view = db.get('vInternaciones')
var router = require('express').Router()

router.post('/update', ({ body }, res, next) => {
  let args = Object.assign({}, body)
  const current = Date.now()
  const fecha = (new Date()).setMinutes(0,0,0)
  const template = args.template
  const registro = args.registro
  const field = {}
  if (registro) field[`enfermeria.registros.${fecha}`] = registro
  table.findOneAndUpdate(
    { _id: monk.id(args._id) },
    {
      $set: Object.assign (
        { modificado: current },
        template && { 'enfermeria.template': template },
        field
      )
    }
  ).then(data => {
    Object.assign(res.locals, { data })
    next()
  }).catch(next)
})

module.exports = router
