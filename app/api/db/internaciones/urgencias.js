const monk = require('monk')
const db = require('../connection')
const response = require('../response')
const table = db.get('pacientes')
const view = db.get('vPacientes')
var router = require('express').Router()
/*
router.post('/create', ({ body }, res, next) => {
  let args = Object.assign({}, body)
  table.update(
    {_id: args.cedula},
    {
      $push: {
        historial: {
          $each: [ args._id ],
          $position: 0
        }
      }
    },
    {castIds: false}
  )
  .then(data => {
    view.findOne({_id: args.cedula}, {castIds: false})
    .then(data => {
      Object.assign(body, data)
      next()
    }).catch(next)
  }).catch(next)
})
*/
module.exports = router
