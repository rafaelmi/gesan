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
      $push: { evolucion:
        {
          value: args.evolucion,
          fecha: current
        }
      }
    }
  ).then(data => {
    Object.assign(res.locals, { data })
  next()
  }).catch(next)
})

module.exports = router
