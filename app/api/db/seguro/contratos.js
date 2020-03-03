const monk = require('monk');
//const db = require('./connection');
const db = monk('localhost/seguro');
const response = require('../response').response;

const contratos = db.get('contratos');
const counters = db.get('counters');

function create(args, session) {
  if (!session.username) {
    return Promise.resolve(response(403));
  }
  return counters.findOneAndUpdate(
    {collection: 'contratos' },
    {$inc:{lastId:1}}
  ).then((counter) => {
    args._id = counter.lastId.toString();
    args.fechaCreacion = new Date();
    return contratos.insert(args, {castIds: false})
    .then(data => {
      data.id = args._id;
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
  return contratos.find()
  .then(data => {
    return response(200, data);
  });
}

module.exports = {
    create,
    get,
    getAll,
};
