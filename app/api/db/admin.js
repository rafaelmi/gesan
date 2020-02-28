const monk = require('monk');
const db = require('./connection');
const crypto = require('crypto');
const response = require('./response').response;

const users = db.get('usuarios');

function createUser(args) {
  args._id = args.username;
  delete args.username;
  args.fechaCreacion = new Date();
  args.estado = 'Activo';
  args.password = crypto.createHash('sha256')
                        .update(args.password)
                        .digest('hex');
  return users.insert(args, {castIds: false})
  .then(data => {
    return response(254);
  });
}

module.exports = {
    createUser,
};
