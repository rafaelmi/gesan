const monk = require('monk');
//const db = require('./connection');
const db = monk('localhost/seguro');
const response = require('../response').response;

const contratos = db.get('contratos');
const viewContratos = db.get('viewContratos');
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
    args.acreditado = 0;
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
  return viewContratos.find()
  .then(data => {
    const today = {
      day: new Date().getDay(),
      month: new Date().getMonth(),
      year: new Date().getYear()
    };
    data.map(record => {
      let asegurados = record.asegurados[0] ? record.asegurados[0].cantidad : 0;
      let adicional = asegurados > 1 ? (record.planDetails[0].adicional * (asegurados - 1 )) : 0
      let cuota = record.planDetails[0].cuota + adicional;
      let cobertura = record.planDetails[0].cobertura;
      let fechaInicio = new Date (record.fechaInicio);
      let meses = ((today.year - fechaInicio.getYear()) * 12) +
        (today.month - fechaInicio.getMonth());
      meses += (meses && (today.day >= fechaInicio.getDay()) ? 1 : 0);
      meses += 1;
      let abonado = 0;
      record.pagos.forEach(pago => {
        abonado += pago.monto;
      });
      let mora = meses - (abonado/cuota);
      let disponible = record.planDetails[0].cobertura;
      console.log(disponible);
      record.visaciones.forEach(visacion => {
        disponible -= visacion.cobertura;
      });
      Object.assign(record, {
        cuota: cuota,
        cobertura: cobertura,
        disponible: disponible,
        mora: mora,
        asegurados: asegurados
      });
    });
    return response(200, data);
  });
}

function update(args) {
  return contratos.findOneAndUpdate({
    _id: args._id,
  },
  {$set: args},{castIds: false})
  .then(dbres => {
    var resCode = 500;
    if (dbres) {
      resCode = 200;
    }
    return response(resCode, dbres);
  })
}

function remove(args) {
  return contratos.remove({
    _id: args._id,
  },{castIds: false})
  .then(dbres => {
    var resCode = 500;
    if (dbres.result.n == 1) {
      resCode = 200;
    }
    return response(resCode, dbres);
  })
}

module.exports = {
    create,
    get,
    getAll,
    update,
    remove
};
