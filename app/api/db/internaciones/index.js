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

module.exports = router
