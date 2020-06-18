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

// Init conditions
consultas.include && consultas.include({ io, personas })
medisur.include && medisur.include({ io, personas })
personas.include && personas.include({ io })

function checkPermission({url, body, session}) {
  permisos = Object.assign({
      user: {
        login: true
      }
    },
    session.permisos
  )
  let path = url.split('/')
  path.shift()
  body.command && path.push(body.command)
  const res = path.reduce((acc, cur) => {
    return ((typeof acc) === 'object') && acc[cur]
  }, permisos)
  return res
}

function handle(req, res, module) {
  // req.session.username = true // temporal, salta la autenticación
  new Promise((resolve, reject) => {
    if (!checkPermission(req)) throw 403
    const func = req.params && req.params.modulo ?
      module[req.params.modulo][req.body.command] :
      module[req.body.command]
    func(
      req.body.args,
      req.session,
      io,
      req.headers['x-forwarded-for']
    ).then((result) => {
      result.room && io.of(module.nsp).emit(result.room, [ result.data ])
      delete result.room
      res.json(result)
    }).catch(reject)
  }).catch((error) => {
    const code = (typeof(error) === 'number') ? error : 500
    res.status(code)
    res.json(response(code, error.stack))
  })
}

function permission({url, session}, res, next) {
  const public = {
    user: {
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
  res.json(response(code, err.stack))
}

app.use('/', permission)
app.use('/test/modtest', test.modtest)
app.use('/', errorPhase)

app.post('/admin', (req, res) => {
  handle(req, res, admin)
})

app.post('/user', (req, res) => {
  handle(req, res, user)
})

app.post('/personas', (req, res) => {
  handle(req, res, personas)
})

app.post('/medisur/:modulo', (req, res) => {
  handle(req, res, medisur)
})

app.post('/consultas', (req, res) => {
  handle(req, res, consultas)
})

{
  const modulos = { consultas, medisur }
  Object.keys(modulos).forEach(modulo => {
    io.of('/'+modulo).on('connection', (socket) => {
      socket.on('subscribe', (args) => {
        store.get(args.sid, (error, session) => {
          try {
            if (
              !session.username
              || !session.permisos
              || !session.permisos[modulo]
            ) throw response(403)
            modulos[modulo].subscribe(args, socket, store)
            .then(() => {})
            .catch((error) => console.log(error))
          } catch (error) { console.log (error) }
        })
      })
    })
  })
}

io.on('connection', (socket) => {
  socket.on('subscribe', (args) => {
    store.get(args.sid, (error, session) => {
      if (session.username) {
        const allowedRooms = session.allowedRooms || {}
        Object.keys(allowedRooms).forEach(room => {
          if (allowedRooms[room]) {
            const mod = { personas }[room]
            if (mod) {
              socket.join(room)
              mod.getAll().then(data => {
                socket.emit(room, data)
              }).catch(error => { console.log(error) })
            }
          }
        })
      }
    })
  })
})

const port = process.env.PORT || 3000
server.listen(port, () => {
    console.log(`listening on ${port}`)
})
