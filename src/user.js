const FormData = require('form-data')

// A helper method to sleep/block.
const timer = ms => new Promise(resolve => setTimeout(resolve, ms))

/**
 * User wraps the meeting access and information, and provides methods to
 * interact with a meeting.
 */
class User {
  /**
   * @typedef {import('./client')} Client
   */

  /**
   * @param {object} data
   * @param {Client} client
   */
  constructor(data, client) {
    /**
     * Raw data from the create/join request
     */
    this.data = data
    this.api = client
  }

  /**
   * @returns {string} accessKey
   */
  get accessKey() {
    return this.data.access_key
  }

  /**
   * @returns {string} guestToken
   */
  get guestToken() {
    return this.data.room.guest_token
  }

  /**
   * @returns {string} roomId
   */
  get roomId() {
    return this.data.room.id
  }

  /**
   * @returns {boolean} ready
   */
  get ready() {
    return this.data.ready
  }

  /**
   * Using async promise here to shorten the code a lot... ensuring everything
   * is in a try catch block is a must-have here.
   * @returns {Promise<void>}
   */
  waitReady() {
    /* eslint-disable no-async-promise-executor */
    return new Promise(async (resolve, reject) => {
      try {
        const timeout = setTimeout(() => reject('User ready timeout.'), 30000)
        this.data = await this.api.get(`/rooms/${this.accessKey}`)
        while(this.ready === false) {
          await timer(1000)
          this.data = await this.api.get(`/rooms/${this.accessKey}`)
        }
        clearTimeout(timeout)
        resolve()
      } catch(err) {
        reject(err)
      }
    })
    /* eslint-enable no-async-promise-executor */
  }

  /**
   * Send chat message
   * @see https://docs.eyeson.com/docs/rest/references/messages
   * @param {string} content
   * @returns {Promise}
   */
  chat(content) {
    return this.api.post(`/rooms/${this.accessKey}/messages`, { type: 'chat', content })
  }

  /**
   * Send custom message
   * @see https://docs.eyeson.com/docs/rest/references/messages
   * @param {string} content
   * @returns {Promise}
   */
  sendCustomMessage(content) {
    return this.api.post(`/rooms/${this.accessKey}/messages`, { type: 'custom', content })
  }

  /**
   * Start recording
   * @see https://docs.eyeson.com/docs/rest/references/recording
   * @returns {Promise}
   */
  startRecording() {
    return this.api.post(`/rooms/${this.accessKey}/recording`)
  }

  /**
   * Stop recording
   * @returns {Promise}
   */
  stopRecording() {
    return this.api.delete(`/rooms/${this.accessKey}/recording`)
  }

  /**
   * Start broadcast
   * @see https://docs.eyeson.com/docs/rest/references/broadcast
   * @param {string} stream_url - Stream URL
   * @returns {Promise}
   */
  startBroadcast(stream_url) {
    return this.api.post(`/rooms/${this.accessKey}/broadcasts`, { stream_url })
  }

  /**
   * Stop broadcast
   * @returns {Promise}
   */
  stopBroadcast() {
    return this.api.delete(`/rooms/${this.accessKey}/broadcasts`)
  }

  /**
   * @typedef {Array<number|string>} MapEntry
   * @prop {number} x
   * @prop {number} y
   * @prop {number} width
   * @prop {number} height
   * @prop {'auto'|'contain'|'cover'} [objectFit]
   * 
   * @typedef {object} AudioInsertPosition
   * @prop {number} [x]
   * @prop {number} [y]
   * 
   * @typedef {object} LayoutOptions
   * @prop {'auto'|'custom'} [layout]
   * @prop {string} [name]
   * @prop {string|Array<MapEntry>} [map]
   * @prop {Array<string>} [users]
   * @prop {boolean} [show_names]
   * @prop {boolean} [voice_activation]
   * @prop {'enabled'|'disabled'|'audio_only'} [audio_insert]
   * @prop {AudioInsertPosition} [audio_insert_position]
   */

  /**
   * Set layout
   * @see https://docs.eyeson.com/docs/rest/references/layout
   * @param {LayoutOptions} options - Layout options
   * @returns {Promise}
   */
  setLayout(options) {
    return this.api.post(`/rooms/${this.accessKey}/layout`, options)
  }

  /**
   * @typedef {object} LayerInsert
   * @prop {string} [icon] - url of icon
   * @prop {string} [title]
   * @prop {string} [content]
   * 
   * @typedef {object} LayerOptions
   * @prop {string} [url]
   * @prop {LayerInsert} [insert]
   * @prop {1|-1|'1'|'-1'} [z-index] - "-1" for background or "1" (default) for foreground position
   */

  /**
   * Set layer
   * @see https://docs.eyeson.com/docs/rest/references/layers
   * @param {LayerOptions} options - Layer options
   * @returns {Promise}
   */
  setLayer(options) {
    return this.api.post(`/rooms/${this.accessKey}/layers`, options)
  }

  /**
   * @typedef {object} EyesonLayer
   * @prop {Function} createBuffer
   */

  /**
   * Send layer
   * @see https://docs.eyeson.com/docs/rest/references/layers
   * @param {Buffer|EyesonLayer} buffer - Layer object or image file buffer
   * @param {1|-1|'1'|'-1'} [zIndex] - Foreground = 1, background = -1, default: 1
   * @param {'png'|'jpg'} [imageType] - image type of buffer, default "png"
   * @param {String} [id] - layer id, default empty
   * @returns {Promise}
   */
  sendLayer(buffer, zIndex = 1, imageType = 'png', id = '') {
    if (buffer && typeof buffer === 'object' && typeof buffer.createBuffer === 'function') {
      buffer = buffer.createBuffer()
    }
    const ending = imageType === 'jpg' ? 'jpg' : 'png'
    const formData = new FormData()
    formData.append('file', buffer, { filename: `image.${ending}` })
    formData.append('z-index', zIndex)
    if (id !== '') {
      formData.append('id', id)
    }
    return this.api.post(`/rooms/${this.accessKey}/layers`, formData)
  }

  /**
   * Clear layer
   * @param {1|-1|'1'|'-1'} [zIndex] - Foreground = 1, background = -1, default: 1
   * @returns {Promise}
   */
  clearLayer(zIndex = 1) {
    return this.api.delete(`/rooms/${this.accessKey}/layers/${zIndex}`)
  }

  /**
   * @typedef {object} PlaybackEntry
   * @prop {string} url - Hosted MP4/WEBM video or MP3 audio file
   * @prop {boolean} [audio] - default false
   * @prop {string} [play_id] - identifier, e.g. current timestamp or use a custom layout position identifier
   * @prop {string} [replacement_id] - User-id of the participant's video to be replaced
   * @prop {string} [name] - Custom readable name for identification
   * @prop {number} [loop_count] - Number of repetitions. Set -1 for infinite loop. Default: 0
   * 
   * @typedef {object} PlaybackOptions
   * @prop {PlaybackEntry} playback
   */

  /**
   * Start playback
   * @see https://docs.eyeson.com/docs/rest/references/playbacks
   * @param {PlaybackOptions|PlaybackEntry} options - Playback options
   * @returns {Promise}
   */
  startPlayback(options) {
    return this.api.post(`/rooms/${this.accessKey}/playbacks`, options)
  }

  /**
   * Stop playback by play_id
   * @see https://docs.eyeson.com/docs/rest/references/playbacks#stop-playback
   * @param {string} play_id
   * @returns {Promise}
   */
  stopPlayback(play_id) {
    return this.api.delete(`/rooms/${this.accessKey}/playbacks/${play_id}`)
  }

  /**
   * Create snapshot
   * @see https://docs.eyeson.com/docs/rest/references/snapshot
   * @returns {Promise}
   */
  snapshot() {
    return this.api.post(`/rooms/${this.accessKey}/snapshot`)
  }

  /**
   * Lock meeting
   * @see https://docs.eyeson.com/docs/rest/references/lock
   * @returns {Promise}
   */
  lockMeeting() {
    return this.api.post(`/rooms/${this.accessKey}/lock`)
  }

  /**
   * Stop meeting
   * @returns {Promise}
   */
  stopMeeting() {
    return this.api.delete(`/rooms/${this.accessKey}`)
  }
}

module.exports = User
