const monk = require('monk');
const db = require('../connection');
const response = require('../response')

const contratos = db.get('medisurContratos')
const vContratos = db.get('vMedisurContratos')
const planes = db.get('vMedisurPlanes')
// const eventos = db.get('medisurEventos')
const validaciones = require('./validaciones')
const eventos = require('./eventos')

function include (modules) {
  io = modules.io
  personas = modules.personas
}

function create(args, session) {
  return new Promise((resolve, reject) => {
    if (!session.username) {
      resolve(403)
    } else {
      validaciones.cobertura(args).then(({ mora, aprobado, producto }) => {
        if (mora > 0) resolve(response(451, { mora }))
        else if (!aprobado) resolve(response(450))
        else {
          const props = {
            fecha: Date.now(),
            producto: producto._id,
            monto: aprobado
            // estado: 'ACTIVO'
          }
          let command = { $push: { 'eventos.$[evento].prestaciones': props } }
          if (producto.nombre === 'CONSULTA GENERAL'){
            command.$set = { 'eventos.$[evento].estado': 'CERRADO' }
          }
          contratos.findOneAndUpdate(
            { _id: args.contrato },
            command,
            {
              castIds: false,
              arrayFilters: [{'evento.estado': {$eq: 'ACTIVO'}}]
            }
          ).then(data => {
            resolve(response((aprobado < args.monto ? 251 : 250), data))
            vContratos.findOne(
              {_id: args.contrato},
              {castIds: false}
            ).then((data) => {
              io.of('/medisur').emit('contratos', [ data ])
            }).catch(reject)
          }).catch(reject)
        }
      }).catch(reject)
    }
  })
}

module.exports = {
    create
};
