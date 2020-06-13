const monk = require('monk');
const db = require('../connection');
const response = require('../response')

const contratos = db.get('medisurContratos')
const pagos = db.get('pagos');

function include (modules) {
  io = modules.io
}

function create(args, session) {
  return new Promise((resolve, reject) => {
    if (!session.username) {
      resolve(403)
    } else {
      const props = Object.assign({}, args)
      props.monto = parseInt(props.monto, 10);
      return pagos.insert(props, {castIds: false})
        .then(pago => {
          return contratos.findOneAndUpdate(
            {_id: args.contrato},
            {$inc:{acreditado: parseInt(args.monto, 10)}},
            {castIds: false}
          ).then((contrato) => {
            return response(200, pago);
          })
        })
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
  return pagos.find()
  .then(data => {
    return response(200, data);
  });
}

module.exports = {
    create,
    getAll,
};
