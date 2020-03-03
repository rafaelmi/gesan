const monk = require('monk');
const db = monk('localhost/seguro');
const response = require('../response').response;

const contratos = db.get('contratos');
const pagos = db.get('pagos');

function create(args, session) {
  if (!session.username) {
    return Promise.resolve(response(403));
  }
  console.log(args);
  return contratos.findOne(
    {_id: args.contrato }, {castIds: false}
  ).then((contrato) => {
    return pagos.insert(args, {castIds: false})
    .then(data => {
      return response(200, data);
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
