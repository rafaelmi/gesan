const monk = require('monk')
const db = require('../../connection')
const table = db.get('internaciones')
const view = db.get('vInternaciones')
var router = require('express').Router()

router.post('/create', ({ body, session }, res, next) => {
  let args = Object.assign({}, body)
  let _id = args._id
  delete args._id
  let key = Object.keys(args)[0]
  let val = args[key]
  const current = Date.now()
  table.findOneAndUpdate(
    { _id: monk.id(_id) },
    {
      $set: Object.assign(
        {
          modificado: current
        },
        Object.fromEntries([[`historia.last.${key}`, val]])
      ),
      $push: { 'historia.historico':
        Object.assign(
          {
            fecha: current
          },
          Object.fromEntries([[key, val]])
        )
      }
    }
  ).then(data => {
    Object.assign(res.locals, { data })
  next()
  }).catch(next)
})

module.exports = router
