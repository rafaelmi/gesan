const monk = require('monk');
const db = monk('localhost/sanasur');
const crypto = require('crypto');
const response = require('./response')

const users = db.get('authUsuarios');

function createUser(args) {
  args._id = args.username;
  delete args.username;
  args.fechaCreacion = new Date();
  args.estado = 'Activo';
  args.password = crypto.createHash('sha256')
                        .update(args.password)
                        .digest('hex');
  //return users.insert(args, {castIds: false})
  return users.findOneAndUpdate({_id: args._id}, {$set: args}, {castIds: false, upsert: true})
  .then(data => {
    return response(254, data);
  }).catch(err => { return response(450, err) })
}

module.exports = {
    createUser,
};
