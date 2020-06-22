const monk = require('monk');
const db = require('../connection');
const response = require('../response')

const contratos = db.get('medisurContratos')
const vContratos = db.get('vMedisurContratos')
const planes = db.get('vMedisurPlanes')
// const eventos = db.get('medisurEventos')
const validaciones = require('./validaciones')
const eventos = require('./eventos')

module.exports = ({ io }) => {
  const router = require('express').Router()

  router.post('/create', ({ body }, res, next) => {
    validaciones.cobertura(args).then(({ mora, aprobado, producto }) => {
      if (mora > 0) throw 451
      else if (!aprobado) throw 450
      const props = {
        fecha: Date.now(),
        producto: producto._id,
        monto: aprobado
        // estado: 'ACTIVO'
      }
      let command = { $push: { 'eventos.$[evento].prestaciones': props } }
      if (producto.nombre === 'CONSULTA GENERAL'){
        command.$set = { 'eventos.$[evento].estado': 'CERRADO' }
      }
      contratos.findOneAndUpdate(
        { _id: args.contrato },
        command,
        {
          castIds: false,
          arrayFilters: [{'evento.estado': {$eq: 'ACTIVO'}}]
        }
      ).then(data => {
        res.json(response((aprobado < args.monto ? 251 : 250), data))
        vContratos.findOne(
          {_id: args.contrato},
          {castIds: false}
        ).then((data) => {
          io.of('/medisur').emit('contratos', [ data ])
        }).catch(next)
      }).catch(next)
    }).catch(next)
  })

  return router
}
