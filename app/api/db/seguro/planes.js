const monk = require('monk');
const db = monk('localhost/seguro');
const response = require('../response').response;

const planes = db.get('planes');

function getAll(args, session) {
  if (!session.username) {
    return Promise.resolve(response(403));
  }
  return planes.find()
  .then(data => {
    return response(200, data);
  });
}

function update(args) {
  let _id = monk.id(args._id);
  delete args._id;
  return planes.findOneAndUpdate({
    _id: _id,
  },
  {$set: args})
  .then(dbres => {
    var resCode = 500;
    if (dbres) {
      resCode = 200;
    }
    return response(resCode, dbres);
  })
}

module.exports = {
    getAll,
    update
};
