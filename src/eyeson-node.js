const Client = require('./client')
const User = require('./user')
const Observer = require('./observer')

const hostname = 'api.eyeson.team'

class Eyeson {
  constructor(config) {
    this.api = new Client({ hostname, ...config })
    /**
     * Meeting observer
     * emits "connected", "disconnected", and "event"
     * Events can be found here:
     * @see https://docs.eyeson.com/docs/category/meeting-observer
     */
    this.observer = new Observer({ hostname, ...config })
  }

  /**
   * Create a new meeting or join an existing by roomId
   * @see https://docs.eyeson.com/docs/rest/references/room
   * @param {string} username - Display name of the user
   * @param {string} [roomId] - If not set, a random id will be returned
   * @param {object} [params] - { name: ..., user: {...}, options: {...} }
   * @returns {Promise<User>}
   */
  join(username, roomId, params = {}) {
    return new Promise((resolve, reject) => {
       if (!username || username === '') {
         return reject('Username is required.')
       }
       const user = { name: username, ...params.user }
       const room = { id: roomId, name: params.name }
       const options = params.options
       this.api.post('/rooms', { ...room, user, options })
         .then(response => resolve(new User(response, new Client({ hostname }))))
         .catch(err => reject(err))
    })
  }
}

module.exports = Eyeson
