const monk = require('monk');
const db = require('../connection')
const response = require('../response')
const table = db.get('pacientes')
const view = db.get('vPacientes')
var router = require('express').Router()

router.post('/mul', (req, res, next) => {
  res.json({"x*2": req.body.x*2, "x*3":req.body.x*3})
})

router.post('/sum', (req, res, next) => {
  res.json({"x+2": req.body.x+2, "x+3":req.body.x+3})
})

function create(args, session) {
  return new Promise((resolve, reject) => {
    Promise.all([
      counters.findOneAndUpdate(
        {collection: 'medisurContratos' },
        {$inc:{lastId:1}}
      ),
      planes.findOne({nombre: args.plan}),
      personas.update(args)
    ]).then (values => {
    })
  })
}

module.exports = router
