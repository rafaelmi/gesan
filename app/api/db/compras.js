const monk = require('monk');
const db = require('./connection');
const response = require('./response').response;

const compras = db.get('transacciones');
const usuarios = db.get('usuarios');

function reserve(args, session) {
  if (!session.username || session.tipo != 'Socio') {
    return Promise.resolve(response(403));
  }
  try {
  return compras.findOneAndUpdate({
    _id: args._id,
    estado: 'Creado',
  },
  {$set: {estado: 'Reservado', socio: session.username}},{castIds: false})
  .then(dbres => {
    var resCode = 500;
    if (dbres) {
      return usuarios.findOneAndUpdate({
        _id: session.username,
        saldo: { $gte: dbres.monto },
      },{$inc: {saldo: -dbres.monto}},{castIds: false})
      .then(dbUser => {
        if (dbUser) {
          resCode = 255;
        } else {
          return compras.findOneAndUpdate({
            _id: args._id,
          },
          {$set: {estado: 'Rechazado'}},{castIds: false})
          .then(dbRej => {
            if (dbRej) {
              resCode = 450;
            }
            return response(resCode, dbres);
          });
        }
        return response(resCode, dbres);
      });
    } else {
      resCode = 454;
      dbres = {};
    }
    return response(resCode, dbres);
  });
  }catch(error){
    console.log(error);
  }
}

function confirm(args, session) {
  if (!session.username || session.tipo != 'Socio') {
    return Promise.resolve(response(403));
  }
  return compras.update({
    _id: args._id,
    socio: session.username,
    estado: 'Reservado',
  },
  {$set: {estado: 'Aprobado', cuotas: args.cuotas}},{castIds: false})
  .then(dbres => {
    var resCode = 500;
    if (dbres.nModified == 1) {
      resCode = 250;
    } else if (dbres.n == 0) {
      return compras.findOne({_id: args._id})
      .then(fres => {
        if (!fres){
          resCode = 404;
        }else {
          switch(fres.estado){
            case 'Cancelado': {
              resCode = 451;
              break;
            }
            case 'Aprobado': {
              resCode = 253;
              break;
            }
            default: {
              // TODO: Colocar error del servidor
            }
          }
        }
        return response(resCode);
      })
    } else {
      // TODO: Colocar error del servidor
    }
    return response(resCode);
  });
}

function cancel(args, session) {
  if (!session.username || session.tipo != 'Socio') {
    return Promise.resolve(response(403));
  }
  return compras.update({
    _id: args._id,
    socio: session.username,
    estado: 'Reservado',
  },
  {$set: {estado: 'Cancelado'}},{castIds: false})
  .then(dbres => {
    var resCode = 500;
    if (dbres.nModified == 1) {
      resCode = 200;
    } else if (dbres.n == 0) {
      return compras.findOne({_id: args._id})
      .then(fres => {
        if (!fres){
          resCode = 404;
        }else {
          resCode = 455;
        }
        return response(resCode);
      })
    } else {
      // TODO: Colocar error del servidor
    }
    return response(resCode);
  });
}

function get(args, session) {
  if (!session.username) {
    return Promise.resolve(response(403));
  }
  return compras.findOne({_id: args._id, socio: session.username},{castIds: false})
  .then(data => {
    return response(200, data);
  });
}

function getAll(args, session) {
  if (!session.username) {
    return Promise.resolve(response(403));
  }
  return compras.find({socio: session.username})
  .then(data => {
    return response(200, data);
  });

}


module.exports = {
    reserve,
    confirm,
    cancel,
    get,
    getAll,
};
