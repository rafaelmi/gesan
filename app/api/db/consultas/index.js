const monk = require('monk');
const db = monk('localhost/sanasur');
const response = require('../response')

const consultas = db.get('consultas');
const counters = db.get('counters');

function include (modules) {
  io = modules.io
  personas = modules.personas
}

function create(args, session) {
  return new Promise((resolve, reject) => {
    if (!session.username) {
      resolve(response(403))
    } else {
      const operador = {}
      operador['turno.' + args.letra] = 1
      counters.findOneAndUpdate(
        {collection: 'consultas'},
        {$inc: operador}
      ).then((counter) => {
        args.turno = args.letra + (counter.turno[args.letra] % 100).toString();
        args.fecha = new Date();
        args.modificado = args.fecha
        args.estado = "EN ESPERA"
        delete args.letra
        consultas.insert(args)
        .then(data => {
          io.of('/consultas').emit('update', [ data ])
          // io.sockets.to('consultas').emit('update', [ data ])
          resolve(response(200))
        })
      })
    }
  })
}

function update(args, session) {
  return new Promise((resolve, reject) => {
    if (!session.username) {
      resolve(response(403));
    } else {
        const id = monk.id(args._id)
        delete args._id
        args.modificado = new Date();
        consultas.findOneAndUpdate({ _id: id }, { $set: args })
          .then(data => {
            io.of('/consultas').emit('update', [ data ])
            // io.sockets.to('consultas').emit('update', [ data ])
            resolve(response(200))
          })
    }
  })
}

function addService(args, session) {
  return new Promise((resolve, reject) => {
    if (!session.username) {
      resolve(response(403));
    } else {
        consultas.findOneAndUpdate(
          { _id: monk.id(args._id) },
          {
            $set: { modificado: new Date() },
            $push: { servicios: args.servicio }
          })
          .then(data => {
            io.of('/consultas').emit('update', [ data ])
            resolve(response(200))
          })
    }
  })
}

function subscribe(args, socket, store) {
  return new Promise((resolve, reject) => {
    store.get(args.sid, (error, session) => {
      socket.join('consultas')
      consultas.find().then(data => {
        socket.emit('update', data)
        resolve(response(200))
      }).catch(reject)
    })
  })
}

function get(args, session) {
  if (!session.username) {
    return Promise.resolve(response(403));
  }
  return consultas.findOne({_id: args._id, comercio: session.username},{castIds: false})
  .then(data => {
    return response(200, data);
  });
}

function getAll(args, session) {
  if (!session.username) {
    return Promise.resolve(response(403));
  }
  return consultas.find()
  .then(data => {
    return response(200, data);
  });
}
/*
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
*/
module.exports = {
    include,
    create,
    subscribe,
    // get,
    // getAll,
    update,
    addService
    // remove
};
