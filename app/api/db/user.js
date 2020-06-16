const monk = require('monk')
const db = monk('localhost/sanasur')
const crypto = require('crypto')
const response = require('./response')

const users = db.get('vAuthUsuarios')

function login(args, session) {
  return new Promise((resolve, reject) => {
    if (session.username) throw 452
    args.password = crypto.createHash('sha256')
                          .update(args.password)
                          .digest('hex');
    users.findOne({_id: args.username,
                          password: args.password},
                        {castIds: false})
    .then(data => {
      if (!data) throw 401
      data.username = data._id;
      data.usuario = data._id;
      delete data._id;
      delete data.password;
      session.username = data.username;
      session.usuario = data.usuario
      session.nombre = data.nombre;
      session.tipo = data.tipo;
      session.allowedRooms = data.allowedRooms || []
      data.sid = session.id

      {
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

        Object.assign(session, { perfiles }, { permisos })
        Object.assign(data, { perfiles }, { permisos })
      }
      resolve(response(200, data))
    }).catch(reject)
  })
}

function info(args, session) {
  return new Promise((resolve, reject) => {
    if (!session.username) {
      resolve(response(403));
    } else {
      users.findOne({_id: session.username},
                          {castIds: false})
        .then(data => {
          if (!data) {
            resolve(response(500))
          } else {
            data.username = data._id;
            data.usuario = data._id;
            delete data._id;
            delete data.password;
            data.sid = session.id
            resolve(response(200, data))
          }
        })
    }
  })
}


function logout(args, session) {
  if (!session.username) {
    return Promise.resolve(response(453));
  }
  session.destroy();
  return Promise.resolve(response(200));
}


module.exports = {
    login,
    logout,
    info
}
