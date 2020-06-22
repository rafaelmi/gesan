const db = require('../connection');
const response = require('../response')

const contratos = db.get('medisurContratos');
const viewAsegurados = db.get('viewAsegurados');

module.exports = ({ io }) => {
  const router = require('express').Router()

  router.post('/create', ({ body }, res, next) => {
    let args = Object.assign({}, body)
    contratos.findOneAndUpdate(
      {_id: args.contrato},
      {$push: {adherentes: args.cedula}},
      {castIds: false}
    ).then(data => {
      io.of('/medisur').emit('contratos', [ data ])
      res.json(response(200))
    }).catch(next)
  })

  return router
}
/*
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
*/
