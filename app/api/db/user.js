const Joi = require('@hapi/joi')
const monk = require('monk')
const db = monk('localhost/sanasur')
const crypto = require('crypto')
const response = require('./response')
const router = require('express').Router()

const users = db.get('vAuthUsuarios')
const table = db.get('authUsuarios')
const view = users

function setPermisos(data) {
  const callback = (acc, permisos) => {
    Object.keys(permisos).forEach(key => {
      if (typeof(acc[key]) === 'object'){
        if (typeof(permisos[key]) === 'object'){
          callback(acc[key], permisos[key])
        }
      } else {
        acc[key] = permisos[key] || acc[key]
      }
    })
  }

  let perfiles = []
  const permisos = data.perfiles.reduce((acc, perfil) => {
    perfiles.push(perfil._id)
    callback(acc,perfil.permisos)
    return acc
  },{})

  Object.assign(data, { perfiles }, { permisos })
}

router.post('/login', ({ body, session }, res, next) => {
  let args = Object.create(body)
  if (session.username) throw 452
  args.password = crypto.createHash('sha256')
                        .update(args.password)
                        .digest('hex');
  users.findOne({_id: args.username,
                        password: args.password},
                      {castIds: false})
  .then(data => {
    if (!data) throw 401
    data.username = data._id
    data.usuario = data._id
    delete data._id
    delete data.password
    session.username = data.username
    session.usuario = data.usuario
    session.nombre = data.nombre
    session.tipo = data.tipo
    session.flags = data.flags
    // session.allowedRooms = data.allowedRooms || []
    // data.sid = session.id

    setPermisos(data)
    Object.assign(session, { perfiles: data.perfiles }, { permisos: data.permisos })
    /*
    session.timeout = setTimeout((sess) => {
      sess && sess.username && sess.destroy()
    }, 1000 * 60 * 1, session).unref()
    */
    res.locals.data = data
    next()
    // res.json(response(200, data))
  }).catch(next)
})

router.post('/info', ({ body, session }, res, next) => {
  let args = Object.create(body)
  session.sid = args.sid
  if (!session.username) throw 403
  users.findOne({_id: session.username},
                      {castIds: false})
  .then(data => {
    if (!data) throw 500
    data.username = data._id;
    data.usuario = data._id;
    delete data._id;
    delete data.password;
    // data.sid = session.id
    setPermisos(data)
    res.locals.data = data
    next()
    // res.json(response(200, data))
  }).catch(next)
})


router.post('/logout', ({ body, session }, res, next) => {
  let args = Object.create(body)
  if (!session.username) throw 453
  session.destroy();
  res.json(response(200))
})

const schema = Joi.object({
  username: Joi.string()
    .min(3)
    .max(15)
    .required(),

  password: Joi.string()
    .min(3)
    .max(15)
    .required(),

  new: Joi.string()
    .min(3)
    .max(15)
    // .pattern(new RegExp('^[a-zA-Z0-9]{6,15}$'))
    .required(),

  repeat: Joi.ref('new')
}).with('new', 'repeat');

router.post('/password/update', ({ body }, res, next) => {
  schema.validateAsync(Object.create(body)).then(val => {
    const password = (pass) => {
      return crypto.createHash('sha256')
                .update(pass)
                .digest('hex')
    }
    view.findOne({
                    _id: val.username,
                     password: password(val.password)
                  },{castIds: false})
    .then(data => {
      if (!data) throw 401
      args = {
        password: password(val.new),
        modificado: Date.now()
      }
      table.findOneAndUpdate(
        {_id: val.username},
        {$set: args},
        {castIds: false}
      ).then(data => {
        next()
      }).catch(next)
    }).catch(next)
  }).catch(() => { throw 400 })
})

module.exports = router
