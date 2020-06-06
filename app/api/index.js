const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const session = require('express-session')
const redis = require('redis')

const personas = require('./db/personas')
const admin = require('./db/admin')
const user = require('./db/user')
const medisur = require('./db/medisur')
/*
const seguro = {
  contratos: require('./db/seguro/contratos'),
  asegurados: require('./db/seguro/asegurados'),
  pagos: require('./db/seguro/pagos'),
  visaciones: require('./db/seguro/visaciones'),
  planes: require('./db/seguro/planes')
} */
/* const consultas = {
  turnos: require('./db/consultas/turnos'),
} */
const consultas = require('./db/consultas')

const app = express();
const server = require('http').Server(app)
const io = require('socket.io')(server)

let RedisStore = require('connect-redis')(session)
const store = new RedisStore({ client: redis.createClient() })

//const sharedsession = require("express-socket.io-session");

/*io.use(sharedsession(session, {
    autoSave:true
}));*/

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
/*app.use(session({
  secret: '6097c39f56b10b3415f0918f5a93111f',
  resave: false,
  saveUninitialized: true,
}))*/

// Init conditions
medisur.include && medisur.include({ io, personas })
personas.include && personas.include({ io })

function handle(req, res, module) {
  // req.session.username = true // temporal, salta la autenticación
  const func = req.params && req.params.modulo ?
    module[req.params.modulo][req.body.command] :
    module[req.body.command]
  // module[req.body.command]
  func(
    req.body.args,
    req.session,
    io,
    req.headers['x-forwarded-for']
  ).then((result) => {
    result.room && io.of(module.nsp).emit(result.room, [ result.data ])
    delete result.room
    res.json(result)
  }).catch((error) => {
    res.status(500);
    res.json(require('./db/response')(500, error.stack))
  })
}

app.post('/admin', function(req, res) {
  handle(req, res, admin)
})

app.post('/user', (req, res) => {
  // req.body.args.session = req.session;
  handle(req, res, user)
})
/*
app.post('/seguro/contratos', (req, res) => {
  handle(req, res, seguro.contratos)
});

app.post('/seguro/asegurados', (req, res) => {
  handle(req, res, seguro.asegurados)
});

app.post('/seguro/pagos', (req, res) => {
  handle(req, res, seguro.pagos)
});

app.post('/seguro/visaciones', (req, res) => {
  handle(req, res, seguro.visaciones)
});

app.post('/seguro/planes', (req, res) => {
  handle(req, res, seguro.planes)
});
*/

app.post('/personas', (req, res) => {
  handle(req, res, personas)
})

app.post('/medisur/:modulo', (req, res) => {
  handle(req, res, medisur)
})

app.post('/consultas', (req, res) => {
  handle(req, res, consultas)
})
/*
io.on('connection', (socket) => {
  socket.on('subscribe', (args) => {
    consultas['subscribe'](args, socket, store)
      .then(() => {})
      .catch((error) => {
        console.log(error)
      })
  })
})
*/
io.of('/consultas').on('connection', (socket) => {
  socket.on('subscribe', (args) => {
    consultas.subscribe(args, socket, store)
      .then(() => {})
      .catch((error) => {
        console.log(error)
      })
  })
})

io.of('/medisur').on('connection', (socket) => {
  socket.on('subscribe', (args) => {
    store.get(args.sid, (error, session) => {
      if (session.username) {
        const allowedRooms = (session.allowedRooms && session.allowedRooms.medisur) || {}
        Object.keys(allowedRooms).forEach(room => {
          if (allowedRooms[room]) {
            socket.join(room)
            medisur.getRoomData(room).then(data => {
              socket.emit(room, data)
            }).catch(() => {})
          }
        })
      }
    })
  })
})

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
