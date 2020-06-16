const monk = require('monk');
const db = require('../connection')
//const db = monk('localhost/seguro');
const response = require('../response')

// var personas // = require('../personas')
// var io
const contratos = db.get('medisurContratos')
const planes = db.get('vMedisurPlanes')
const vContratos = db.get('vMedisurContratos')
const counters = db.get('counters')

function include (modules) {
  io = modules.io
  personas = modules.personas
}

function create(args, session) {
  return new Promise((resolve, reject) => {
    if (!session.username) {
      resolve(403)
    } else {
      Promise.all([
        counters.findOneAndUpdate(
          {collection: 'medisurContratos' },
          {$inc:{lastId:1}}
        ),
        planes.findOne({nombre: args.plan}),
        personas.update(args)
      ]).then (values => {
        const counter = values[0]
        const plan = values[1]
        const titular = values[2].data._id
        const currentDate = Date.now()
        const fechaInicio = new Date(args.fechaInicio).getTime()
        // const prestaciones = plan.prestaciones.filter(el => el.cobertura.por !== 'PERSONA')
        const props = Object.assign(
          {},
          {
            _id: counter.lastId.toString(),
            titular,
            // titular: values[2].data._id,
            creado: currentDate,
            modificado: currentDate,
            plan: monk.id(plan._id),
            fechaInicio: fechaInicio,
            estado: 'ACTIVO'
            /*
            eventos: [{
              inicio: fechaInicio,
              cierre: fechaInicio,
              isInitial: true, // Bandera de evento de iniciación de contrato
              visados: plan.prestaciones.filter(el => !el.cobertura || el.cobertura.por !== 'PERSONA')
              .reduce((acc, el) => {
                const cobertura = el.cobertura || [{}]
                const producto = el.producto
                cobertura.forEach(item => {
                  acc.push(
                    Object.assign(
                      {},
                      {
                        fecha: fechaInicio,
                        producto: producto._id,
                        carencia: fechaInicio + ((item.carencia || 0) * 86400000), // 1000 * 60 * 60 * 24. Dia de carencia
                        cantidad: item.cantidad || Infinity,
                        monto: item.monto || '100%',
                      }
                    )
                  )
                })
                return acc
              }, [])
            }]
            */
          },
          {
            cuota: plan.cuota,
            adicional:plan.adicional,
            adherentes: [ titular ]
          }
        )
        contratos.insert(props, {castIds: false}).then(data => {
          // data.id = args._id;
          io.of('/medisur').emit('contratos', [ data ])
          resolve(response(200, data))
        }).catch(reject)
      }).catch(reject)
    }
  })
}
/*
function addAdherente (args) {
  return new Promise((resolve, reject) => {
    if (!session.username) {
      resolve(403)
    } else {
      contratos.insert(props, {castIds: false}).then(data => {
        // data.id = args._id;
        resolve(response(200, data, 'contratos'))
      }).catch(reject)
    }
  })
}
*/

function getAll(args, session) {
  if (!session.username) {
    return Promise.resolve(response(403));
  }
  return vContratos.find()
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

function getRoomData() {
  return vContratos.find()
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

function subscribe(args, socket, store) {
  return new Promise((resolve, reject) => {
    store.get(args.sid, (error, session) => {
      vContratos.find().then(data => {
        socket.emit('contratos', data)
        resolve(response(200))
      }).catch(reject)
    })
  })
}

/*
function subscribe(args, socket, store) {
  return new Promise((resolve, reject) => {
    store.get(args.sid, (error, session) => {
      if (!session.username) {
        resolve(response(403))
      } else {
        socket.join('seguro')
        contratos.find()
          .then(data => {
            socket.emit('seguro', data)
            resolve(response(200))
          });
      }
    })
  })
}
*/

module.exports = {
    include,
    create,
    // getAll,
    // getRoomData,
    // update,
    // remove,
    subscribe
};
