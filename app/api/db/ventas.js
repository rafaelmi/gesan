const monk = require('monk');
const db = require('./connection');
const response = require('./response').response;

const ventas = db.get('transacciones');
const counters = db.get('counters');

function create(args, session) {
  if (!session.username || session.tipo != 'Comercio') {
    return Promise.resolve(response(403));
  }
  return counters.findOneAndUpdate(
    {collection: 'transacciones' },
    {$inc:{lastId:1}}
  ).then((counter) => {
    args._id = counter.lastId.toString();
    args.monto = parseInt(args.monto, 10);
    args.comercio = session.username;
    args.comercioNombre = session.nombre;
    args.fechaCreacion = new Date();
    args.estado = 'Creado';
    return ventas.insert(args, {castIds: false})
    .then(data => {
      return response(251, data);
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
  return ventas.find({comercio: session.username})
  .then(data => {
    return response(200, data);
  });
}

module.exports = {
    create,
    get,
    getAll,
};
