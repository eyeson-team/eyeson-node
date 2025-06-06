const Client = require('./client')
const User = require('./user')
const observer = require('./observer')
const permalink = require('./permalink')
const RoomForward = require('./forward')

const hostname = 'api.eyeson.team'

/**
 * @typedef {object} EyesonConfig
 * @prop {string} apiKey
 *
 * @typedef {object} UserParameters
 * @prop {string} [id] - custom user id, if empty, a random id will be assigned
 * @prop {string} [avatar] - url
 * 
 * @typedef {object} AudioInsertPosition
 * @prop {number} [x]
 * @prop {number} [y]
 * 
 * @typedef {object} CustomFieldOptions
 * @prop {string} [locale] - User preferred language code ('en', 'de', 'fr').
 * @prop {string} [logo] - URL to custom logo.
 * @prop {boolean} [hide_chat] - Hide chat in GUI. Default: false
 * @prop {boolean} [virtual_background] - Enable Virtual Background selection. Default: false
 * @prop {boolean} [virtual_background_allow_guest] - Enable Virtual Background selection for Guest users. Default: false
 * @prop {string} [virtual_background_image] - Provide a custom Virtual Background image for selection.
 * 
 * @typedef {object} MeetingOptions
 * @prop {boolean} [show_names] - Show display names in video. Default: true
 * @prop {boolean} [show_label] - Show Eyeson logos in GUI. Default: true
 * @prop {string} [exit_url] - Exit destination, URL for exit button in GUI
 * @prop {boolean} [recording_available] - Allow recordings. Default: true
 * @prop {boolean} [broadcast_available] - Allow broadcasting. Default: true
 * @prop {boolean} [reaction_available] - Show gif media inserts in GUI. Default: true
 * @prop {boolean} [layout_available] - Allow layout updates. Default: true
 * @prop {boolean} [guest_token_available] - Provide guest token. Default: true
 * @prop {boolean} [lock_available] - Enable meeting lock. Default: false
 * @prop {boolean} [kick_available] - Allow participant kick. Default: true
 * @prop {'disabled'|'screencast'|'ptp'} [sfu_mode] - Set a desired sfu mode. Default: 'ptp'
 * @prop {boolean} [widescreen] - Run meeting in widescreen mode (16:9 aspect ratio). Default: false
 * @prop {string} [background_color] - Set meeting background color as hex RGB. Default: '#121212'
 * @prop {'enabled'|'disabled'|'audio_only'} [audio_insert] - Show audio insert. Default: 'audio_only'
 * @prop {AudioInsertPosition} [audio_insert_position] - Position of the audio insert.
 * @prop {CustomFieldOptions & Record<string, any>} [custom_fields]
 * 
 * @typedef {object} MeetingParameters
 * @prop {string} [name] - room name
 * @prop {UserParameters} [user]
 * @prop {MeetingOptions} [options]
 */

/**
 * Class Eyeson
 */
class Eyeson {
  /**
   * A static property for layer z-index "1"
   * @type {number}
   * @static
   */
  static layerForeground = 1;
  /**
   * A static property for layer z-index "-1"
   * @type {number}
   * @static
   */
  static layerBackground = -1;
  /**
   * A static property for webhook type room update
   * @type {string}
   * @static
   */
  static webhookRoom = 'room_update';
  /**
   * A static property for webhook type recording update
   * @type {string}
   * @static
   */
  static webhookRecording = 'recording_update';

  /**
   * @param {EyesonConfig} config
   */
  constructor(config) {
    this.api = new Client({ hostname, ...config })
    /**
     * Meeting observer
     * emits "connected", "disconnected", and "event"
     * Events can be found here:
     * @see https://docs.eyeson.com/docs/rest/advanced/meeting_observer
     */
    this.observer = new observer.Observer({ hostname, ...config })
    this.permalink = new permalink.PermalinkAPI(this.api)
  }

  /**
   * Create a new meeting or join an existing by roomId
   * @see https://docs.eyeson.com/docs/rest/references/meeting-room
   * @param {string} username - Display name of the user
   * @param {string|null} [roomId] - If not set, a random id will be returned
   * @param {MeetingParameters} [params] - { name: ..., user: {...}, options: {...} }
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

  /**
   * Get user object by accessKey
   * @param {string} accessKey
   * @returns {Promise<User>}
   */
  getUser(accessKey) {
    return new Promise((resolve, reject) => {
      if (!accessKey || accessKey === '') {
        return reject('accessKey is required.')
      }
      const api = new Client({ hostname })
      api.get(`/rooms/${accessKey}`)
        .then(response => resolve(new User(response, api)))
        .catch(err => reject(err))
    })
  }

  /**
   * @typedef {object} GuestUserParamsCustomFields
   * @prop {string} locale - User preferred language code (en, de, fr)
   * 
   * @typedef {object} GuestUserParams
   * @prop {string} [id] - User identifier
   * @prop {string} [avatar] - 	URL to a user avatar
   * @prop {GuestUserParamsCustomFields & Record<string, any>} custom_fields
   */

  /**
   * Register guest user
   * @see https://docs.eyeson.com/docs/rest/references/user#register-guest-user
   * @param {string} username - Users name to be displayed in participants list
   * @param {string} guestToken - guest token of the meeting
   * @param {GuestUserParams} [params]
   * @returns {Promise<User>}
   */
  registerGuest(username, guestToken, params = {}) {
    return new Promise((resolve, reject) => {
      if (!username || username === '') {
        return reject('Username is required.')
      }
      if (!guestToken || guestToken === '') {
        return reject('guestToken is required.')
      }
      const api = new Client({ hostname })
      const user = { name: username, ...params }
      api.post(`/guests/${guestToken}`, user)
        .then(response => resolve(new User(response, api)))
        .catch(err => reject(err))
    })
  }

  /**
   * Get list of current running meetings
   * @see https://docs.eyeson.com/docs/rest/references/meeting-room#get-list-of-current-running-meetings
   * @returns {Promise<Array<object>>}
   */
  getAllCurrentMeetings() {
    return this.api.get('/rooms')
  }

  /**
   * Get snapshot data
   * @see https://docs.eyeson.com/docs/rest/references/snapshot
   * @param {string} snapshotId
   * @returns {Promise<object>}
   */
  getSnapshot(snapshotId) {
    return this.api.get(`/snapshots/${snapshotId}`)
  }

  /**
   * Retrieve list of all snapshots of a certain room
   * @see https://docs.eyeson.com/docs/rest/references/snapshot#retrieve-list-of-all-snapshots-of-a-room
   * @param {string} roomId
   * @param {number} [page] - Fetch next set of recordings (limit is 25)
   * @param {string} [started_at] - ISO8601 Timestamp. Filter for a certain room instance (compare to started_at in room response)
   * @param {string} [since] - ISO8601 Timestamp. Filter all snapshots since date
   * @param {string} [until] - ISO8601 Timestamp. Filter all snapshots until date
   * @returns {Promise<Array<object>>}
   */
  getRoomSnapshots(roomId, page, started_at, since, until) {
    const params = new URLSearchParams()
    if (typeof page === 'number') {
      params.set('page', page)
    }
    if (typeof started_at == 'string' && started_at !== '') {
      params.set('started_at', started_at)
    }
    if (typeof since == 'string' && since !== '') {
      params.set('since', since)
    }
    if (typeof until == 'string' && until !== '') {
      params.set('until', until)
    }
    let url = `/rooms/${roomId}/snapshots`
    if (params.size > 0) {
      url += '?' + params.toString()
    }
    return this.api.get(url)
  }

  /**
   * Delete snapshot
   * @param {string} snapshotId
   * @returns {Promise}
   */
  deleteSnapshot(snapshotId) {
    return this.api.delete(`/snapshots/${snapshotId}`)
  }

  /**
   * Get recording data
   * @see https://docs.eyeson.com/docs/rest/references/recording
   * @param {string} recordingId
   * @returns {Promise<object>}
   */
  getRecording(recordingId) {
    return this.api.get(`/recordings/${recordingId}`)
  }

  /**
   * Retrieve list of all recordings of a certain room
   * @see https://docs.eyeson.com/docs/rest/references/recording#retrieve-list-of-all-recordings-of-a-certain-room
   * @param {string} roomId
   * @param {number} [page] - Fetch next set of recordings (limit is 25)
   * @param {string} [started_at] - ISO8601 Timestamp. Filter for a certain room instance (compare to started_at in room response)
   * @param {string} [since] - ISO8601 Timestamp. Filter all recordings since date
   * @param {string} [until] - ISO8601 Timestamp. Filter all recordings until date
   * @returns {Promise<Array<object>>}
   */
  getRoomRecordings(roomId, page, started_at, since, until) {
    const params = new URLSearchParams()
    if (typeof page === 'number') {
      params.set('page', page)
    }
    if (typeof started_at == 'string' && started_at !== '') {
      params.set('started_at', started_at)
    }
    if (typeof since == 'string' && since !== '') {
      params.set('since', since)
    }
    if (typeof until == 'string' && until !== '') {
      params.set('until', until)
    }
    let url = `/rooms/${roomId}/recordings`
    if (params.size > 0) {
      url += '?' + params.toString()
    }
    return this.api.get(url)
  }

  /**
   * Delete recording
   * @param {string} recordingId
   * @returns {Promise}
   */
  deleteRecording(recordingId) {
    return this.api.delete(`/recordings/${recordingId}`)
  }

  /**
   * Retrieve list of all participants (users) of a certain room
   * Optional filter for online users
   * @see https://docs.eyeson.com/docs/rest/references/user#get-list-of-meeting-participants-users
   * @param {string} roomId 
   * @param {boolean|null} isOnline 
   * @returns {Promise<Array<object>>}
   */
  getRoomUsers(roomId, isOnline = null) {
    const params = new URLSearchParams()
    if (typeof isOnline === 'boolean') {
      params.set('online', isOnline)
    }
    let url = `/rooms/${roomId}/users`
    if (params.size > 0) {
      url += '?' + params.toString()
    }
    return this.api.get(url)
  }

  /**
   * Create a room forward instance
   * @param {string} roomId
   * @returns {RoomForward} forward
   */
  createRoomForward(roomId) {
    return new RoomForward(this.api, roomId)
  }

  /**
   * Shutdown meeting room
   * @param {string} roomId
   * @returns {Promise}
   */
  shutdownRoom(roomId) {
    return this.api.delete(`/rooms/${roomId}`)
  }

  /**
   * Register a webhook
   * @see https://docs.eyeson.com/docs/rest/advanced/register_webhooks
   * @param {string} url
   * @param {string|Array<string>} [types] - comma-seperated list of types or array. default: room_update
   * @returns {Promise<object>} webhook
   */
  registerWebhook(url, types = 'room_update') {
    return new Promise((resolve, reject) => {
      if (!url) {
        return reject('URL is required.')
      }
      if (Array.isArray(types)) {
        types = types.join(',')
      }
      this.api.post('/webhooks', { url, types })
        .then(() => this.getWebhook())
        .then(webhook => resolve(webhook))
        .catch(err => reject(err))
    })
  }

  /**
   * Get currently registered webhook
   * @returns {Promise<object|null>} webhook or null
   */
  getWebhook() {
    return this.api.get('/webhooks')
  }

  /**
   * Clear current webhook if any
   * @returns {Promise}
   */
  clearWebhook() {
    return new Promise((resolve, reject) => {
      this.getWebhook()
        .then(webhook => {
          if (webhook) {
            return this.api.delete(`/webhooks/${webhook.id}`)
          }
        })
        .then(() => resolve())
        .catch(err => reject(err))
    })
  }
}

module.exports = Eyeson
