const db = require('../connection');
const response = require('../response')

const viewContratos = db.get('viewContratos');
const visaciones = db.get('visaciones');
const counters = db.get('counters');

function create(args, session) {
  if (!session.username) {
    return Promise.resolve(response(403));
  }
  args.cobertura = parseInt(args.cobertura, 10);
  return viewContratos.findOne(
    {_id: args.contrato},{castIds: false}
  ).then(contrato => {
    if (contrato){
      const today = {
        day: new Date().getDay(),
        month: new Date().getMonth(),
        year: new Date().getYear()
      };
      let fechaInicio = new Date (contrato.fechaInicio);
      let mora = ((today.year - fechaInicio.getYear()) * 12) +
        (today.month - fechaInicio.getMonth());
      mora += (mora && (today.day >= fechaInicio.getDay()) ? 1 : 0);
      let usado = args.cobertura;
      contrato.visaciones.forEach(visacion => {
        usado += visacion.cobertura;
      });
      console.log(usado);
      console.log(contrato.planDetails[0]);
      if ((usado > contrato.planDetails[0].cobertura) || (mora > 0)) {
        return response(450);
      } else {
        return counters.findOneAndUpdate(
          {collection: 'visaciones' },
          {$inc:{lastId:1}}
        ).then((counter) => {
          args._id = counter.lastId.toString();
          args.fecha = new Date();
          return visaciones.insert(args, {castIds: false})
          .then(data => {
            return response(200, data);
          });
        });
      }
    }
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
  return visaciones.find()
  .then(data => {
    return response(200, data);
  });
}

module.exports = {
    create,
    getAll,
};
