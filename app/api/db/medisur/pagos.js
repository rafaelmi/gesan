const monk = require('monk');
const db = require('../connection');
const response = require('../response')

const contratos = db.get('medisurContratos')
const vContratos = db.get('vMedisurContratos')
const facturas = db.get('facturas');

function include (modules) {
  io = modules.io
}

function create(args, session) {
  return new Promise((resolve, reject) => {
    if (!session.username) {
      resolve(403)
    } else {
      const props = Object.assign(
        {},
        args,
        {
          creado: Date.now(),
          fecha: new Date(args.fecha).getTime(),
          monto: parseInt(args.monto, 10)
        }
      )
      facturas.insert(props, {castIds: false})
      .then(pago => {
        vContratos.findOne(
          {_id: args.contrato},
          {castIds: false}
        ).then((contrato) => {
          io.of('/medisur').emit('contratos', [ contrato ])
          const cuotasPagas = pago.monto / contrato.cuota
          contratos.findOneAndUpdate(
            {_id: args.contrato},
            {$inc: { cuotasPagas }},
            {castIds: false}
          ).then((contrato) => {
            resolve(response(200, pago))
          }).catch(reject)
        }).catch(reject)
      }).catch(reject)
    }
  })
}

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
  return facturas.find()
  .then(data => {
    return response(200, data);
  });
}

module.exports = {
    create,
    // getAll,
};
