const API_URL = '/api'

export default {
  methods: {
    apiCommand (args) {
      const url = API_URL + args.url
      const command = {
        command: args.command,
        args: args.args
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
  }
}
