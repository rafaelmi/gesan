const monk = require('monk')
const db = require('../connection')
const table = db.get('internaciones')
const view = db.get('vInternaciones')
// const request = require('http').request
// const bodyParser = require('body-parser')

var router = require('express').Router()

/*
router.post('/create', ({ body, session }, { locals }, next) => {
  let args = Object.assign({}, body.producto)
  if (args._id) {
    locals.args = args
    next()
  } else {
    delete args._id
    const options = {
      port: 3000,
      path: '/productos/create',
      method: 'POST',
      headers: {
        'content-type': 'application/json'
      }
    }

    const prodReq = request(options, (result) => {
      result.on('data', (data) => {
        locals.args = bodyParser.json(data.data)
      })
      result.on('end', () => {
        console.log(locals.args)
        next()
      })
    })

    prodReq.on('error', next)
    prodReq.write(JSON.stringify(args));
    prodReq.end();
  }
}, (req, { locals }, next) => {
*/

  router.post('/create', ({ body }, { locals }, next) => {
    let args = Object.assign({}, body)
    const current = Date.now()
    args.producto.fecha = current
    table.findOneAndUpdate(
      { _id: monk.id(args._id) },
      {
        $set: { modificado: current },
        $push: { productos: args.producto }
      }
    ).then(data => {
      Object.assign(locals, { data })
      next()
    }).catch(next)
  }
)

module.exports = router
