const Joi = require('@hapi/joi')
const db = require('./connection')
const response = require('./response')
const personas = db.get('personas')

const schema = Joi.object({
  nombre: Joi.string()
    .min(3)
    .max(50)
    .required(),

  cedula: Joi.number()
    .integer()
    .positive()
    .required(),

  nacimiento: Joi.number()
    .integer()
    .positive(),

  sexo: Joi.string()
    .min(1)
    .max(1),

  direccion: Joi.string().max(100),
  telefono: Joi.string().max(30),
  ciudad: Joi.string().max(50),
  departamento: Joi.string().max(50),
  // creado: Joi.date().required(),
  modificado: Joi.number()
    .integer()
    .positive()
    .required()
})

/*
function get(args) {
  return new Promise((resolve, reject) => {
    personas.findOne({_id: args._id},{castIds: false})
    .then(data => {
      resolve(response(200, data))
    }).catch(() => { reject(500) })
  })
}

function getAll() {
  return new Promise((resolve, reject) => {
    personas.find()
    .then(data => {
      resolve(data)
    }).catch(reject)
  })
}
*/
module.exports = ({ io }) => {
  const router = require('express').Router()

  function update({ body }, res, next) {
    let args = Object.assign({}, body.persona || body)
    props = Object.create(args) // OJO: Object.create() garantiza discriminar propiedades
    props.nacimiento && (props.nacimiento = new Date(props.nacimiento).getTime())
    props.modificado = Date.now()
    schema.validateAsync(props).then(val => {
      val._id = val.cedula
      delete val.cedula
      personas.findOneAndUpdate(
        {_id: val._id},
        {$set: Object.assign({},val)}, // OJO: Object.assign() garantiza discriminar propiedades
        {castIds: false, upsert: true}
      ).then(data => {
        io.of('/').emit('personas', [ data ])
        body.cedula = data._id
        delete body.persona
        next()
      }).catch(next) // TODO: Establecer error de validación
    }).catch(next)
  }

  router.post('/get', ({ body, session }, res, next) => {
    let args = Object.assign({}, body)
    personas.find(args, {castIds: false})
    .then(data => {
      io.to(session.sid).emit('personas', data)
      res.json(response(200))
    }).catch(next)
  })

  router.post('/medisur/contratos/create', update)
  router.post('/medisur/asegurados/create', update)
  
  router.post('/historial/pacientes/create', update)

  router.use('/', (req, res, next) => {
    if ( req.body.persona ) update(req, res, next)
    else next()
  })

  return router
}
/*
module.exports = {
  include,
  update,
  get,
  getAll
}
*/
