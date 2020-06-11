const monk = require('monk');
const db = require('../connection');
const response = require('../response')

const contratos = db.get('medisurContratos')
const vContratos = db.get('vMedisurContratos')
const planes = db.get('vMedisurPlanes')

function pago (args) {
  return new Promise((resolve, reject) => {
    vContratos.findOne(
      { _id: args.contrato },
      { castIds: false }
    ).then(contrato => {
      if (!contrato) throw { stack: 'Contrato no se encuentra' }
      const currentDate = new Date()
      const fechaInicio = new Date(contrato.fechaInicio)
      if (currentDate < fechaInicio) throw { stack: 'Fecha de inicio del contrato incorrecta' }
      let months = currentDate.getUTCMonth() - fechaInicio.getUTCMonth()
      months += (currentDate.getUTCFullYear() - fechaInicio.getUTCFullYear()) * 12
      months += currentDate.getUTCDate() < fechaInicio.getUTCDate() ? 0 : 1 // +1 xq se paga mes adelantado

      resolve({ contrato, mora: (months - (contrato.cuotasPagas || 0))}) // Retorna los meses de mora
    }).catch(reject)
  })
}

function cobertura (args) {
  return new Promise((resolve, reject) => {
    pago(args).then(({ contrato, mora }) => {
      if (mora > 0) {
        // resolve(response(451, { mora }))
        resolve({ mora })
      } else {
        planes.findOne({_id: monk.id(contrato.plan)}).then(plan => {
          const toDay = val => val / (1000 * 60 * 60 * 24)
          const curDate = new Date()
          const days = toDay(curDate - contrato.fechaInicio) // Día representado en minutos
          const prestacion = plan.prestaciones.find(el => el.producto.nombre === args.producto)
          const cobertura = prestacion.cobertura && prestacion.cobertura.reduce((acc, cur) => {
            if (cur.carencia < days) {
              acc.cantidad += cur.cantidad || Infinity
              acc.monto += (cur.monto !== '100%') ? cur.monto : Infinity
              acc.cada = {
                'AÑO': 360,
                'MES': 30
              }[cur.cada] || cur.cada
              acc.por = cur.por
            }
            return acc
          }, {
            cantidad: 0,
            monto: 0,
          })
          // console.log(cobertura)
          const limites = prestacion.limites
          const eventos = (cobertura.por === 'GF')
            ? contrato.eventos
            : contrato.eventos.filter(el => {
              return el.adherente === contrato.eventos.find(el =>  {
                return el.estado === 'ACTIVO'
              }).adherente
            })
          const usado = eventos.reduce((acc, cur) => {
            let found = false
            cur.prestaciones && cur.prestaciones.forEach(el => {
              if (el.producto._id.toString() === prestacion.producto._id.toString()){
                found = true
                if ((typeof(cobertura.cada) === 'number') && (toDay(curDate - el.fecha) < cobertura.cada)){
                  acc.cantidad += 1
                  acc.monto += el.monto
                }
              }
            })
            acc.eventos += found && (toDay(curDate - (cur.fin || cur.inicio)) < 360) && 1
            return acc
          }, {
            cantidad: 0,
            monto: 0,
            eventos: 0
          })
          const aprobado = (
            (usado.cantidad <= cobertura.cantidad)
            && (!limites || (usado.eventos < limites.eventos))
            && (!args.monto || Math.max(0, Math.min(args.monto, (cobertura.monto - usado.monto))))
          )
          resolve({ contrato, plan, mora, aprobado, producto: prestacion.producto })
        }).catch(reject)
      }
    }).catch(reject)
  })
}

module.exports = {
    pago,
    cobertura
}
