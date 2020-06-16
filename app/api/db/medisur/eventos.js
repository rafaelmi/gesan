const monk = require('monk');
const db = require('../connection');
const response = require('../response')

const contratos = db.get('medisurContratos')
const vContratos = db.get('vMedisurContratos')
const planes = db.get('vMedisurPlanes')
const validaciones = require('./validaciones')

function include (modules) {
  io = modules.io
  personas = modules.personas
}

function create(args, session) {
  return new Promise((resolve, reject) => {
    if (!session.username) {
      resolve(403)
    } else {
      validaciones.pago(args).then(({ mora }) => {
        if (mora > 0) {
          resolve(response(451, { mora }))
        } else {
          const props = {
            adherente: args.adherente,
            inicio: Date.now(),
            estado: 'ACTIVO'
          }
          contratos.findOneAndUpdate(
            { _id: args.contrato, adherentes: args.adherente },
            { $push: { eventos: props } },
            { castIds: false }
          ).then(data => {
            resolve(response(200, data))
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

/*
  args.cobertura = parseInt(args.cobertura, 10);
  return viewContratos.findOne(
    {_id: args.contrato},{castIds: false}
  ).then(contrato => {
    if (contrato){
      const today = {
        day: new Date().getDay(),
        month: new Date().getMonth(),
        year: new Date().getYear()
      };
      let fechaInicio = new Date (contrato.fechaInicio);
      let mora = ((today.year - fechaInicio.getYear()) * 12) +
        (today.month - fechaInicio.getMonth());
      mora += (mora && (today.day >= fechaInicio.getDay()) ? 1 : 0);
      let usado = args.cobertura;
      contrato.visaciones.forEach(visacion => {
        usado += visacion.cobertura;
      });
      console.log(usado);
      console.log(contrato.planDetails[0]);
      if ((usado > contrato.planDetails[0].cobertura) || (mora > 0)) {
        return response(450);
      } else {
        return counters.findOneAndUpdate(
          {collection: 'visaciones' },
          {$inc:{lastId:1}}
        ).then((counter) => {
          args._id = counter.lastId.toString();
          args.fecha = new Date();
          return visaciones.insert(args, {castIds: false})
          .then(data => {
            return response(200, data);
          });
        });
      }
    }
  });
}
*/

function getAll(args, session) {
  if (!session.username) {
    return Promise.resolve(response(403));
  }
  return visaciones.find()
  .then(data => {
    return response(200, data);
  });
}

module.exports = {
    create,
    // getAll,
};
