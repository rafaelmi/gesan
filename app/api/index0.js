const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const session = require('express-session');

const admin = require('./db/admin');
const user = require('./db/user');
const seguro = {
  contratos: require('./db/seguro/contratos'),
  asegurados: require('./db/seguro/asegurados'),
  pagos: require('./db/seguro/pagos'),
  visaciones: require('./db/seguro/visaciones'),
  planes: require('./db/seguro/planes')
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

const port = process.env.PORT || 4000;
app.listen(port, () => {
    console.log(`listening on ${port}`);
});
