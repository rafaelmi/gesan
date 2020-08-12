module.exports = ({ io }) => {
  const router = require('express').Router()
  /*
  const historial = {
    update: (req, { locals }, next) => {
      io.of('/historial').emit('pacientes', locals.data)
    }
  }
  */
  const urgencias = {
    update: (req, { locals }, next) => {
      io.of('/urgencias').emit('update', locals.data)
    }
  }

  const internaciones = {
    update: (req, { locals }, next) => {
      io.of('/internaciones').emit('update', locals.data)
    }
  }

  router.use(({ url, body }, { locals }, next) => {
    let data = locals.data || body
    if (!Array.isArray(data)) data = [ data ]
    locals.data = data
    next()
  })

  // router.post('/consultas/create', historial.update)

  router.post('/urgencias/create', urgencias.update /*, historial.update*/)
  router.post('/urgencias/update', urgencias.update /*, historial.update*/)
  router.post('/urgencias/addService', urgencias.update /*, historial.update*/)
  router.post('/urgencias/get', ({ session }, { locals }) => {
    io.of('/urgencias').to('/urgencias#' + session.sid).emit('update', locals.data)
  })

  router.post('/internaciones/create', internaciones.update)
  router.post('/internaciones/finish', internaciones.update)
  router.post('/internaciones/servicios/create', internaciones.update)
  router.post('/internaciones/evolucion/create', internaciones.update)
  router.post('/internaciones/estudios/create', internaciones.update)
  router.post('/internaciones/enfermeria/update', internaciones.update)
  router.post('/internaciones/historia/create', internaciones.update)
  router.post('/internaciones/indicaciones/nuevo/:command', internaciones.update)
  router.post('/internaciones/get', ({ session }, { locals }) => {
    io.of('/internaciones').to('/internaciones#' + session.sid).emit('update', locals.data)
  })

  // router.post('/historial/pacientes/create', historial.update)

  /*
  // ### IMPORTANTE: sólo aplica para historial, queda pendiente broadcast de consulta
  router.post('/consultas/create', ({ body, session }) => {
    io.of('/historial').emit('pacientes', [ body ])
  })

  router.post('/historial/pacientes/create', ({ body, session }) => {
    io.of('/historial').emit('pacientes', [ body ])
  })
  */

  router.post('/historial/pacientes/get', ({ session }, { locals }) => {
    io.of('/historial').to('/historial#' + session.sid).emit('pacientes', locals.data)
  })

  router.post('/historial/get', ({ session }, { locals }) => {
    io.of('/historial').to('/historial#' + session.sid).emit('historial', locals.data)
  })

  router.post('/medicos/get', ({ session }, { locals }) => {
    io.to(session.sid).emit('medicos', locals.data)
  })

  router.use(() => {})

  return router
}
