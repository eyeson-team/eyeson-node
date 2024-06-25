const User = require('./user.js')
const Client = require('./client.js')

/**
 * Permalink wrapper object
 */
class Permalink {
  /**
   * @param {object} data
   */
  constructor(data) {
    this.data = data
  }
  /**
   * @returns {string} Permalink Id
   */
  get id() {
    return this.data.permalink.id
  }
  /**
   * @returns {string} User token
   */
  get userToken() {
    return this.data.permalink.user_token
  }
  /**
   * @returns {string} Guest token
   */
  get guestToken() {
    return this.data.permalink.guest_token
  }
  /**
   * @returns {boolean} meeting is started
   */
  get started() {
    return this.data.room.started_at !== null
  }
}

/**
 * Permalink API providing functionality
 */
class PermalinkAPI {
  /**
   * @param {Client} api
   */
  constructor(api) {
    this.api = api
  }
  /**
   * @typedef {object} PermalinkMeetingRoomParameters
   * @prop {string} [expires_at] - ISO DateTime String
   */
  /**
   * Create new permalink entry
   * @see https://docs.eyeson.com/docs/rest/features/permalink/#create-permalink
   * @param {string} username
   * @param {import('./eyeson-node.js').MeetingParameters & PermalinkMeetingRoomParameters} [params] - { name: ..., user: {...}, options: {...} }
   * @returns {Promise<Permalink>}
   */
  create(username, params = {}) {
    return new Promise((resolve, reject) => {
      if (!username || username === '') {
        return reject('Username is required.')
      }
      const user = { name: username, ...params.user }
      this.api.post('/permalink', { user, ...params })
        .then(response => resolve(new Permalink(response)))
        .catch(err => reject(err))
    })
  }
  /**
   * @typedef {object} GetAllParameters
   * @prop {number} [page] page, Default: 1
   * @prop {number} [limit] items per page, Default: 25
   * @prop {boolean} [expired] filter only expired or only non-expired
   * 
   * @typedef {object} GetAllObject
   * @prop {number} page
   * @prop {number} limit
   * @prop {number} total
   * @prop {Array<Permalink>} items
   */

  /**
   * List all permalink entries
   * @see https://docs.eyeson.com/docs/rest/features/permalink/#get-list-of-permalinks
   * @param {GetAllParameters} [options] page, limit, expired
   * @returns {Promise<GetAllObject>}
   */
  getAll(options = {}) {
    const { page = 1, limit = 25 } = options
    return new Promise((resolve, reject) => {
      let params = `?page=${page}&limit=${limit}`
      if (Reflect.has(options, 'expired')) {
        params += `&expired=${options.expired}`
      }
      this.api.get(`/permalink${params}`)
        .then(response => {
          response.items = response.items.map(item => new Permalink(item))
          resolve(response)
        })
        .catch(err => reject(err))
    })
  }
  /**
   * Get specific permalink by permalink id
   * @see https://docs.eyeson.com/docs/rest/features/permalink/#get-specific-permalink-by-id
   * @param {string} permalinkId
   * @returns {Promise<Permalink>}
   */
  getbyId(permalinkId) {
    return new Promise((resolve, reject) => {
      if (!permalinkId || permalinkId === '') {
        return reject('Permalink ID is required.')
      }
      this.api.get(`/permalink/${permalinkId}`)
        .then(response => resolve(new Permalink(response)))
        .catch(err => reject(err))
    })
  }
  /**
   * Update permalink settings
   * @see https://docs.eyeson.com/docs/rest/features/permalink/#update-permalink
   * @param {string} permalinkId
   * @param {import('./eyeson-node.js').MeetingParameters & PermalinkMeetingRoomParameters} [params] - { name: ..., user: {...}, options: {...} }
   * @returns {Promise<Permalink>}
   */
  update(permalinkId, params = {}) {
    return new Promise((resolve, reject) => {
      if (!permalinkId || permalinkId === '') {
        return reject('Permalink ID is required.')
      }
      this.api.put(`/permalink/${permalinkId}`, params)
        .then(response => resolve(new Permalink(response)))
        .catch(err => reject(err))
    })
  }
  /**
   * Delete permalink entry
   * @see https://docs.eyeson.com/docs/rest/features/permalink/#delete-permalink
   * @param {string} permalinkId 
   * @returns {Promise}
   */
  delete(permalinkId) {
    return new Promise((resolve, reject) => {
      if (!permalinkId || permalinkId === '') {
        return reject('Permalink ID is required.')
      }
      this.api.delete(`/permalink/${permalinkId}`)
        .then(() => resolve())
        .catch(err => reject(err))
    })
  }
  /**
   * Add user to permalink. User is allowed to start the meeting
   * @see https://docs.eyeson.com/docs/rest/features/permalink/#register-host-user-to-permalink
   * @param {string} permalinkId 
   * @param {string} username 
   * @param {import('./eyeson-node.js').UserParameters} [params] 
   * @returns {Promise<Permalink>}
   */
  addUser(permalinkId, username, params = {}) {
    return new Promise((resolve, reject) => {
      if (!permalinkId || permalinkId === '') {
        return reject('Permalink ID is required.')
      }
      if (!username || username === '') {
        return reject('Username is required.')
      }
      const user = { name: username, ...params }
      this.api.post(`/permalink/${permalinkId}/users`, { user })
        .then(response => resolve(new Permalink(response)))
        .catch(err => reject(err))
    })
  }
  /**
   * Remove user from Permalink to invalidate user-token
   * @see https://docs.eyeson.com/docs/rest/features/permalink/#remove-host-user-from-permalink
   * @param {string} permalinkId 
   * @param {string} userToken 
   * @returns {Promise}
   */
  removeUser(permalinkId, userToken) {
    return new Promise((resolve, reject) => {
      if (!permalinkId || permalinkId === '') {
        return reject('Permalink ID is required.')
      }
      if (!userToken || userToken === '') {
        return reject('User token is required.')
      }
      this.api.delete(`/permalink/${permalinkId}/users/${userToken}`)
        .then(() => resolve())
        .catch(err => reject(err))
    })
  }
  /**
   * Join or start a meeting
   * @see https://docs.eyeson.com/docs/rest/features/permalink/#start-meeting-from-permalink
   * @param {string} userToken 
   * @returns {Promise<User>}
   */
  joinMeeting(userToken) {
    return new Promise((resolve, reject) => {
      if (!userToken || userToken === '') {
        return reject('User token is required.')
      }
      const api = new Client({ hostname: this.api.options.hostname })
      api.post(`/permalink/${userToken}`)
        .then(response => resolve(new User(response, api)))
        .catch(err => reject(err))
    })
  }
  /**
   * Register guest user to meeting. Only works when meeting is started.
   * @see https://docs.eyeson.com/docs/rest/features/permalink/#register-guest-user
   * @param {string} username 
   * @param {string} guestToken 
   * @param {import('./eyeson-node.js').GuestUserParams} [params]
   * @returns {Promise<User>}
   */
  registerGuest(username, guestToken, params = {}) {
    return new Promise((resolve, reject) => {
      if (!username || username === '') {
        return reject('Username is required.')
      }
      if (!guestToken || guestToken === '') {
        return reject('Guest token is required.')
      }
      const api = new Client({ hostname: this.api.options.hostname })
      const user = { name: username, ...params }
      api.post(`/guests/${guestToken}`, user)
        .then(response => resolve(new User(response, api)))
        .catch(err => reject(err))
    })
  }
}

module.exports = { PermalinkAPI, Permalink }
