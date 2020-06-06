const monk = require('monk');
const db = require('../connection');
const response = require('../response')

const contratos = db.get('medisurContratos')
const vContratos = db.get('vMedisurContratos')
const planes = db.get('vMedisurPlanes')
// const eventos = db.get('medisurEventos')

function include (modules) {
  io = modules.io
  personas = modules.personas
}

function validarPago (args) {
  return new Promise((resolve, reject) => {
    vContratos.findOne(
      { _id: args.contrato, adherentes: args.adherente },
      { castIds: false }
    ).then(contrato => {
      if (!contrato) throw { stack: 'Contrato y/o adherente no se encuentra' }
      const currentDate = new Date()
      const fechaInicio = new Date(contrato.fechaInicio)
      if (currentDate < fechaInicio) throw { stack: 'Fecha de inicio del contrato incorrecta' }
      let months = currentDate.getUTCMonth() - fechaInicio.getUTCMonth()
      months += (currentDate.getUTCFullYear() - fechaInicio.getUTCFullYear()) * 12
      months += currentDate.getUTCDate() < fechaInicio.getUTCDate() ? 0 : 1 // +1 xq se paga mes adelantado

      resolve(months - (contrato.cuotasPagas || 0)) // Retorna los meses de mora

      /*
      planes.findOne(_id: monk.id(contrato.plan)).then(plan => {
        if (!Object.keys(plan).length) throw { stack: 'Plan no se encuentra' }
      */

    }).catch(reject)
  })
}

function create(args, session) {
  return new Promise((resolve, reject) => {
    if (!session.username) {
      resolve(403)
    } else {
      validarPago(args).then(mora => {
        if (mora > 0) {
          resolve(response(451, { mora }))
        } else {
          const props = {
            adherente: args.adherente,
            inicio: Date.now(),
            estado: 'ACTIVO'
          }
          contratos.findOneAndUpdate(
            { _id: args.contrato },
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

function get(args, session) {
  if (!session.username) {
    return Promise.resolve(response(403));
  }
  return ventas.findOne({_id: args._id, comercio: session.username},{castIds: false})
  .then(data => {
    return response(200, data);
  });
}

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
    getAll,
};
