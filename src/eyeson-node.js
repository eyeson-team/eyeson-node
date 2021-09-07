
const Client = require('./client')
const User = require('./user')

const hostname = 'api.eyeson.team'

module.exports = class {
  constructor(config) {
    this.api = new Client({ hostname, ...config })
  }

  join(username, roomIdentifier, params = {}) {
    return new Promise((resolve, reject) => {
       if (!username || username === '') {
         return reject('Username is required.')
       }
       const user = { name: username, ...params.user }
       const room = { id: roomIdentifier, name: params.name }
       const options = params.options
       this.api.post('/rooms', { ...room, user, options })
         .then(response => resolve(new User(response, new Client({ hostname }))))
         .catch(err => reject(err))
    })
  }
}
