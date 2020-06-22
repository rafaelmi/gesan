const monk = require('monk');
const db = monk('localhost/sanasur');
const crypto = require('crypto');
const response = require('./response')
const users = db.get('authUsuarios');
const router = require('express').Router()

router.post('/createUser', ({ body }, res, next) => {
  let args = Object.assign({}, body)
  args._id = args.username;
  delete args.username;
  args.fechaCreacion = new Date();
  args.estado = 'Activo';
  args.password = crypto.createHash('sha256')
                        .update(args.password)
                        .digest('hex');
  users.insert(args, {castIds: false})
  .then(data => {
    res.json(response(254, data))
  }).catch(next)
})

module.exports = router
