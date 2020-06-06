const API_URL = '/api'

function command (args) {
  let url = API_URL + args.url
  url += args.modulo ? '/' + args.modulo : ''
  const command = {
    command: args.command,
    args: args.args || {}
  }
  return fetch(url, {
    method: 'POST',
    body: JSON.stringify(command),
    headers: {
      'content-type': 'application/json'
    }
  })
    .then(response => response.json())
}

export default {
  command
}
