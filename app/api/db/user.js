const monk = require('monk');
const db = monk('localhost/sanasur');
const crypto = require('crypto');
const response = require('./response').response;

const users = db.get('usuarios');

/*
// Registra el socket en los rooms designados
function registerRooms(session, io){
  if (session.socketId) {
    const socket = io.sockets.connected[session.socketId]
    const rooms = session.rooms || []
    if (socket) {
      rooms.map(room => {
        console.log(room)
        console.log(socket.rooms)
        socket.join(room)
        console.log(socket.rooms)
      })
    }
  }
}

function setSocket(args, session, io) {
  return new Promise((resolve, reject) => {
    session.socketId = args.socketId // io.sockets.connected[args.socketId]
    registerRooms(session, io)
    resolve(response(200))
  })
}
*/

function login(args, session) {
  return new Promise((resolve, reject) => {
    if (session.username) {
      resolve(response(452));
      // return Promise.resolve(response(452));
    } else {
      args.password = crypto.createHash('sha256')
                            .update(args.password)
                            .digest('hex');
      users.findOne({_id: args.username,
                            password: args.password},
                          {castIds: false})
      .then(data => {
        if (!data) {
          resolve(response(401))
        } else {
          data.username = data._id;
          delete data._id;
          delete data.password;
          session.username = data.username;
          session.nombre = data.nombre;
          session.tipo = data.tipo;
          session.rooms = data.rooms || []
          data.sid = session.id
          // registerRooms(session, io)
          // io.sockets.connected[session.socketId]
          // session.socket = io.sockets.connected[args.socketId]
          /* crypto.randomBytes(32, (err, buf) => {
            session.socketKey = buf.toString('hex')
            data.sid = session.id
            data.socketKey = session.socketKey
            resolve(response(200, data))
          }) */
          resolve(response(200, data))
        }
      })
    }
  })
}

function info(args, session) {
  return new Promise((resolve, reject) => {
    if (!session.username) {
      resolve(response(403));
    } else {
      users.findOne({_id: session.username},
                          {castIds: false})
        .then(data => {
          if (!data) {
            resolve(response(500))
          } else {
            data.username = data._id;
            delete data._id;
            delete data.password;
            data.sid = session.id
            /* data.socketKey = session.socketKey */
            resolve(response(200, data))
          }
        })
    }
  })
}


function logout(args, session) {
  if (!session.username) {
    return Promise.resolve(response(453));
  }
  session.destroy();
  return Promise.resolve(response(200));
}


module.exports = {
    // setSocket,
    login,
    logout,
    info
};
