const monk = require('monk')
const db = require('./connection')
const response = require('./response')
const view = db.get('vMedicos')
var router = require('express').Router()

router.post('/get', (req, res, next) => {
  let args = Object.assign({}, req.body)
  view.find(args, {castIds: false})
  .then(data => {
    req.body = data
    next()
  }).catch(next)
})

module.exports = router
