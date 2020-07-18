const router = require('express').Router()

router.post('/keepAlive', ({ session }, res, next) => {
  if (session.username) next()
  else next(403)
})

module.exports = router
