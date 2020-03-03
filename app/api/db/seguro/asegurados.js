const monk = require('monk');
const db = monk('localhost/seguro');
const response = require('../response').response;

const contratos = db.get('contratos');
const asegurados = db.get('asegurados');
const viewAsegurados = db.get('viewAsegurados');

function create(args, session) {
  if (!session.username) {
    return Promise.resolve(response(403));
  }
  return contratos.findOne(
    {_id: args.contrato }, {castIds: false}
  ).then((contrato) => {
    return asegurados.insert(args)
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
  return viewAsegurados.find()
  .then(data => {
    data.map(record => Object.assign(record, {
      contrato: record.contrato[0]._id,
      plan: record.contrato[0].plan,
      direccion: record.contrato[0].direccion,
      telefono: record.contrato[0].telefono,
      ciudad: record.contrato[0].ciudad,
      departamento: record.contrato[0].departamento
    }));
    return response(200, data);
  });
}

module.exports = {
    create,
    getAll,
};
