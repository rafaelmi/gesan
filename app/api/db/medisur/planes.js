const db = require('../connection');
const response = require('../response')
const planes = db.get('vMedisurPlanes');
const router = require('express').Router()

router.post('/get', ({ body }, res, next) => {
  planes.find(body)
  .then(data => {
    res.json(response(200, data))
  })
})

module.exports = router
