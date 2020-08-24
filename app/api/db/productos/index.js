const monk = require('monk')
const db = monk('localhost/sanasur')

const table = db.get('productos')
const view = db.get('productos')
const counters = db.get('counters')

const router = require('express').Router()

router.post('/create', ({ body }, { locals }, next) => {
  let args = Object.assign({}, body)
  args.modificado = Date.now()
  counters.findOneAndUpdate(
    { _id: 'productos' },
    { $inc: { lastId: 1 } },
    { castIds: false }
  ).then (({ lastId }) => {
    args._id = lastId
    table.insert(args, { castIds: false })
    .then(data => {
      Object.assign(locals, { data })
      next()
    }).catch(next)
  }).catch(next)
})

router.post('/get', ({ body }, { locals }, next) => {
  let args = Object.assign({}, body)
  view.find(args)
  .then(data => {
    Object.assign(locals, { data })
    next()
  })
})

router.post('/update', ({ body, session }, { locals }, next) => {
  let args = Object.assign({}, body)
  const id = monk.id(args._id)
  delete args._id
  args.modificado = Date.now()
  table.findOneAndUpdate({ _id: id }, { $set: args })
  .then(data => {
    Object.assign(locals, { data })
    next()
  })
})

module.exports = router
