const db = require('../connection');
const response = require('../response')

const contratos = db.get('medisurContratos');
const viewAsegurados = db.get('viewAsegurados');

function include (modules) {
  io = modules.io
  personas = modules.personas
}

function create(args, session) {
  return new Promise((resolve, reject) => {
    if (!session.username) {
      resolve(403)
    } else {
      personas.update(args).then(val => {
        contratos.findOneAndUpdate(
          {_id: args.contrato},
          {$push: {adherentes: val.data._id}},
          {castIds: false}
        ).then(data => {
          io.of('/medisur').emit('contratos', [ data ])
          // io.sockets.to('medisur').emit('contratos', [ data ])
          resolve(response(200, data))
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
  return viewAsegurados.find()
  .then(data => {
    data.map(record => Object.assign(record, {
      contrato: record.contrato[0]._id,
      plan: record.contrato[0].plan,
      direccion: record.direccion || record.contrato[0].direccion,
      telefono: record.telefono || record.contrato[0].telefono,
      ciudad: record.ciudad || record.contrato[0].ciudad,
      departamento: record.departamento || record.contrato[0].departamento
    }));
    return response(200, data);
  });
}

function update(args) {
  let _id = monk.id(args._id);
  delete args._id;
  return asegurados.findOneAndUpdate({
    _id: _id,
  },
  {$set: args})
  .then(dbres => {
    var resCode = 500;
    if (dbres) {
      resCode = 200;
    }
    return response(resCode, dbres);
  })
}

module.exports = {
    include,
    create,
    // getAll,
    // update
};
