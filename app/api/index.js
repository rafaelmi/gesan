const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const session = require('express-session')
const redis = require('redis')

const response = require('./db/response')
const personas = require('./db/personas')
const broadcast = require('./db/broadcast')
const admin = require('./db/admin')
const config = require('./db/config')
const user = require('./db/user')
const medisur = require('./db/medisur')
const urgencias = require('./db/urgencias')
const consultas = require('./db/consultas')
const historial = require('./db/historial')
const medicos = require('./db/medicos')
const test = require('./db/test')

const app = express();
const server = require('http').Server(app)
const io = require('socket.io')(server)

let RedisStore = require('connect-redis')(session)
const store = new RedisStore({ client: redis.createClient() })

const ipSanatorio = '181.127.134.182' // '127.0.0.1'

app.use(morgan('tiny'))
app.use(cors())
app.use(bodyParser.json())
app.use(session({
    store: store,
    secret: '6097c39f56b10b3415f0918f5a93111f',
    resave: false,
    saveUninitialized: true
  })
)

function checkOrigin({headers, session}, res, next) {
  if (
    !session.username ||
    (session.flags && session.flags.everywhere) ||
    (headers['x-forwarded-for'] === ipSanatorio)) {
      next()
  } else {
    session.destroy()
    next(451)
  }
}

function checkPermission({url, session}, res, next) {
  const public = {
    user: {
      info: true,
      logout: true,
      login: true
    },
    config: {
      keepAlive: true
    }
  }
  let path = url.split('/')
  path.shift()
  if (path.reduce((acc, cur) => {
      return ((typeof acc) === 'object') && acc[cur]
    }, Object.assign({}, session.permisos, public))
  ) next()
  else next(403)
}

function errorPhase(err, req, res, next) {
  const code = (typeof(err) === 'number') ? err : 500
  res.status(code)
  res.json(response(code, err, err.stack))
}

app.use(({ session }, res, next) => {
  const current = Date.now()
  if (session.lastReqDate && (current - session.lastReqDate > 1000 * 60 * 6)) {
    session.destroy()
    next(403)
  } else {
    session.lastReqDate = current
    next()
  }
})

app.use('/', checkPermission)

app.use('/user', user)

app.use('/', checkOrigin)
app.use('/', personas({ io }))

app.use('/config', config)

app.use('/admin', admin)

app.use('/personas', personas({ io }))

app.use('/urgencias', urgencias)
app.use('/consultas', consultas({ io }))

// app.use('/consultas', historial.consultas)
app.use('/historial/pacientes', historial.pacientes)
app.use('/historial', historial.router)

app.use('/medisur/planes', medisur.planes)
app.use('/medisur/contratos', medisur.contratos({ io }))
app.use('/medisur/asegurados', medisur.asegurados({ io }))
app.use('/medisur/pagos', medisur.pagos({ io }))
app.use('/medisur/eventos', medisur.eventos({ io }))
app.use('/medisur/prestaciones', medisur.prestaciones({ io }))

app.use('/medicos', medicos)

app.use('/', (req, res, next) => {
  res.json(response(200, res.locals.data))
  next()
})

app.use('/', broadcast({ io }))
app.use('/', errorPhase)

io.on('connection', (socket) => {})
io.of('/urgencias').on('connection', () => {})
io.of('/consultas').on('connection', (socket) => { /* console.log('/consultas') */ })
io.of('/medisur').on('connection', (socket) => { /*console.log('/medisur')*/ })
io.of('/historial').on('connection', () => {})
// io.of('/reportes').on('connection', () => {})

const port = process.env.PORT || 3000
server.listen(port, () => {
    console.log(`listening on ${port}`)
})
