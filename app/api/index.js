const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const session = require('express-session')
const redis = require('redis')

const response = require('./db/response')
const personas = require('./db/personas')
const admin = require('./db/admin')
const user = require('./db/user')
const medisur = require('./db/medisur')
const consultas = require('./db/consultas')
const historial = require('./db/historial')
const test = require('./db/test')

const app = express();
const server = require('http').Server(app)
const io = require('socket.io')(server)

let RedisStore = require('connect-redis')(session)
const store = new RedisStore({ client: redis.createClient() })

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

// req.headers['x-forwarded-for']

function checkPermission({url, session}, res, next) {
  const public = {
    user: {
      info: true,
      logout: true,
      login: true
    },
    test: {
      modtest: {
        // sum: true,
        mul: true
      }
    }
  }
  let path = url.split('/')
  path.shift()
  if (path.reduce((acc, cur) => {
      return ((typeof acc) === 'object') && acc[cur]
    }, Object.assign({}, public, session.permisos))
  ) next()
  else next(403)
}

function errorPhase(err, req, res, next) {
  const code = (typeof(err) === 'number') ? err : 500
  res.status(code)
  res.json(response(code, err, err.stack))
}

app.use('/', checkPermission)
app.use('/', personas({ io }))

app.use('/admin', admin)

app.use('/user', user)

app.use('/personas', personas({ io }))

app.use('/consultas', consultas({ io }))

app.use('/medisur/planes', medisur.planes)
app.use('/medisur/contratos', medisur.contratos({ io }))
app.use('/medisur/asegurados', medisur.asegurados({ io }))
app.use('/medisur/pagos', medisur.pagos({ io }))
app.use('/medisur/eventos', medisur.eventos({ io }))
app.use('/medisur/prestaciones', medisur.prestaciones({ io }))

app.use('/', errorPhase)

io.on('connection', (socket) => {})
io.of('/consultas').on('connection', (socket) => { /* console.log('/consultas') */ })
io.of('/medisur').on('connection', (socket) => { /*console.log('/medisur')*/ })

const port = process.env.PORT || 3000
server.listen(port, () => {
    console.log(`listening on ${port}`)
})
