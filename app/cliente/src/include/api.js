const API_URL = '/api'

function command (args) {
  let url = API_URL + (args.url || '/')
  url += args.modulo ? '/' + args.modulo : ''
  url += '/' + args.command
  return fetch(url, {
    method: 'POST',
    body: JSON.stringify(args.args),
    headers: {
      'content-type': 'application/json'
    }
  })
    .then(res => res.json())
}

function sendFile (args) {
  let url = API_URL + (args.url || '/')
  url += args.modulo ? '/' + args.modulo : ''
  return fetch(url, {
    method: 'POST',
    body: args.formData,
    headers: {
      'content-type': 'multipart/form-data'
    }
  })
    .then(res => res.json())
}

export default {
  command,
  sendFile
}
