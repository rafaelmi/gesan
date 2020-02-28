const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const session = require('express-session');

const admin = require('./db/admin');
const user = require('./db/user');
const compras = require('./db/compras');
const ventas = require('./db/ventas');
const seguro = {
  contratos: require('./db/seguro/contratos')
}
const app = express();

app.use(morgan('tiny'));
app.use(cors());
app.use(bodyParser.json());
app.use(session({
  secret: '6bb9e713c2deb3d6c67deeb8f8fceb98',
  resave: false,
  saveUninitialized: true,
}))

function handle(req, res, module, methods) {
  try {
    req.session.username = true // temporal, salta la autenticación
    module[req.body.command](req.body.args, req.session).then((response) => {
      res.json(response);
    });
  } catch (error) {
    res.status(500);
    res.json(error);
  }
}

app.post('/admin', function(req, res) {
  handle(req, res, {
    'createUser': admin.createUser,
  })
});

app.post('/user', (req, res) => {
  req.body.args.session = req.session;
  handle(req, res, {
    'login': user.login,
    'logout': user.logout,
    'info': user.info,
  })
});

app.post('/ventas', (req, res) => {
  handle(req, res, {
    'getAll': ventas.getAll,
    'get': ventas.get,
    'create': ventas.create,
  })
});

app.post('/compras', (req, res) => {
  handle(req, res, {
    'getAll': compras.getAll,
    'get': compras.get,
    'reserve': compras.reserve,
    'confirm': compras.confirm,
    'cancel': compras.cancel,
  })
});

app.post('/seguro/contratos', (req, res) => {
  handle(req, res, seguro.contratos)
});

const port = process.env.PORT || 4000;
app.listen(port, () => {
    console.log(`listening on ${port}`);
});
