const monk = require('monk')
const db = require('../connection')
const response = require('../response')

const contratos = db.get('medisurContratos')
const vContratos = db.get('vMedisurContratos')
const facturas = db.get('facturas')

module.exports = ({ io }) => {
  const router = require('express').Router()

  router.post('/create', ({ body }, res, next) => {
    let args = Object.assign({}, body)
    const props = Object.assign(
      {},
      args,
      {
        creado: Date.now(),
        fecha: new Date(args.fecha).getTime(),
        monto: parseInt(args.monto, 10)
      }
    )
    facturas.insert(props, {castIds: false})
    .then(pago => {
      vContratos.findOne(
        {_id: args.contrato},
        {castIds: false}
      ).then((contrato) => {
        io.of('/medisur').emit('contratos', [ contrato ])
        const cuotasPagas = pago.monto / contrato.cuota
        contratos.findOneAndUpdate(
          {_id: args.contrato},
          {$inc: { cuotasPagas }},
          {castIds: false}
        ).then((contrato) => {
          res.json(response(200))
        }).catch(next)
      }).catch(next)
    }).catch(next)
  })

  return router
}
