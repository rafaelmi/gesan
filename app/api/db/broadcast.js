module.exports = ({ io }) => {
  const router = require('express').Router()

  // ### IMPORTANTE: sólo aplica para historial, queda pendiente broadcast de consulta
  router.post('/consultas/create', ({ body, session }) => {
    io.of('/historial').emit('pacientes', [ body ])
  })

  router.post('/historial/pacientes/create', ({ body, session }) => {
    io.of('/historial').emit('pacientes', [ body ])
  })

  router.post('/historial/pacientes/get', ({ body, session }) => {
    io.of('/historial').to('/historial#' + session.sid).emit('pacientes', body)
  })

  return router
}
