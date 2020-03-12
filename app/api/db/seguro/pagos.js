const monk = require('monk');
const db = monk('localhost/seguro');
const response = require('../response').response;

const contratos = db.get('contratos');
const pagos = db.get('pagos');

function create(args, session) {
  if (!session.username) {
    return Promise.resolve(response(403));
  }
  args.monto = parseInt(args.monto, 10);
  return pagos.insert(args, {castIds: false})
    .then(pago => {
      return contratos.findOneAndUpdate(
        {_id: args.contrato},
        {$inc:{acreditado: parseInt(args.monto, 10)}},
        {castIds: false}
      ).then((contrato) => {
        return response(200, pago);
      });
    });
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
