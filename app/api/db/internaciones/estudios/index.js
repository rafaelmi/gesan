const monk = require('monk')
const db = require('../../connection')
const table = db.get('internaciones')
const view = db.get('vInternaciones')
const dbFiles = db.get('files')
const fs = require('fs');
var router = require('express').Router()

const dir = './files/'

router.post('/upload', ({ body, files }, { locals }, next) => {
  if (!files || Object.keys(files).length === 0) {
    throw 400
  }
  const file = files.file
  dbFiles.insert({
    name: file.name,
    path: 'internaciones/estudios'
  }).then(data => {
    Object.assign(locals, { data })
    file.mv(dir + data._id, next)
  }).catch(next)
})

router.post('/create', ({ body, session }, res, next) => {
  let args = Object.assign({}, body)
  const current = Date.now()
  table.findOneAndUpdate(
    { _id: monk.id(args._id) },
    {
      $set: { modificado: current },
      $push: { estudios:
        Object.assign(
          {},
          args.estudio,
          { fecha: current }
        )
      }
    }
  ).then(data => {
    Object.assign(res.locals, { data })
  next()
  }).catch(next)
})

router.get('/download/:file', (req, res, next) => {
  dbFiles.findOne({_id: monk.id(req.params.file)})
  .then(data => {
    if (!Object.keys(data).length) throw 500
    const id = data._id
    const path = dir + id
    const stat = fs.statSync(path)
    const fileSize = stat.size
    const range = req.headers.range
    if (range) {
      const parts = range.replace(/bytes=/, "").split("-")
      const start = parseInt(parts[0], 10)
      const end = parts[1]
        ? parseInt(parts[1], 10)
        : fileSize-1
      const chunksize = (end-start)+1
      const file = fs.createReadStream(path, {start, end})
      const head = {
        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunksize,
        // 'Content-Type': 'video/mp4',
      }
      res.writeHead(206, head);
      file.pipe(res);
    } else {
      const head = {
        'Content-Length': fileSize,
        'Content-Disposition': `attachment; filename="${data.name}"`
      }
      res.writeHead(200, head)
      fs.createReadStream(path).pipe(res)
    }
  }).catch(next)
})

module.exports = router
