const monk = require('monk');
const db = require('./connection');
const crypto = require('crypto');
const response = require('./response').response;

const users = db.get('usuarios');

function login(args, session) {
  if (session.username) {
    return Promise.resolve(response(452));
  }
  args.password = crypto.createHash('sha256')
                        .update(args.password)
                        .digest('hex');
  return users.findOne({_id: args.username,
                        password: args.password},
                      {castIds: false})
  .then(data => {
    if (!data) {
      return response(401);
    }
    data.username = data._id;
    delete data._id;
    delete data.password;
    args.session.username = data.username;
    args.session.nombre = data.nombre;
    args.session.tipo = data.tipo;
    return response(200, data);
  });
}

function info(args, session) {
  if (!session.username) {
    return Promise.resolve(response(403));
  }
  return users.findOne({_id: session.username},
                      {castIds: false})
  .then(data => {
    if (!data) {
      return response(500);
    }
    data.username = data._id;
    delete data._id;
    delete data.password;
    return response(200, data);
  });
}


function logout(args, session) {
  if (!session.username) {
    return Promise.resolve(response(453));
  }
  args.session.destroy();
  return Promise.resolve(response(200));
}


module.exports = {
    login,
    logout,
    info
};
