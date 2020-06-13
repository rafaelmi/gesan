const Joi = require('@hapi/joi');
const db = require('./connection');
const response = require('./response')
const personas = db.get('personas')
var io

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

function include (modules) {
  io = modules.io
}

function update(args) {
  return new Promise((resolve, reject) => {
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
        // io.sockets.to('/').emit('personas', [ data ])
        resolve(response(200, data))
      }).catch(reject)
    }).catch(reject) // TODO: Establecer error de validación
  })
}

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

module.exports = {
  include,
  update,
  get,
  getAll
}
