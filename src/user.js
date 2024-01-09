// A helper method to sleep/block.
const timer = ms => new Promise(resolve => setTimeout(resolve, ms))

/**
 * User wraps the meeting access and information, and provides methods to
 * interact with a meeting.
 * @param {object} data
 * @param {Client} client
 */
class User {
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
    return this.data['access_key']
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
   * @returns {Promise}
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
   * @param {string} content
   * @returns {Promise}
   */
  chat(content) {
    return this.api.post(`/rooms/${this.accessKey}/messages`, { type: 'chat', content })
  }

  /**
   * Start recording
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
   * @param {string} url - Stream URL
   * @returns {Promise}
   */
  startBroadcast(url) {
    return this.api.post(`/rooms/${this.accessKey}/broadcasts`, { 'stream_url': url })
  }

  /**
   * Stop broadcast
   * @returns {Promise}
   */
  stopBroadcast() {
    return this.api.delete(`/rooms/${this.accessKey}/broadcasts`)
  }

  /**
   * Set layout
   * @see https://docs.eyeson.com/docs/rest/references/layout
   * @param {object} options - Layout options
   * @returns {Promise}
   */
  setLayout(options) {
    return this.api.post(`/rooms/${this.accessKey}/layout`, options)
  }

  /**
   * Set layer
   * @see https://docs.eyeson.com/docs/rest/references/layers
   * @param {object} options - Layer options
   * @returns {Promise}
   */
  setLayer(options) {
    return this.api.post(`/rooms/${this.accessKey}/layers`, options)
  }

  /**
   * Clear layer
   * @param {1|-1|'1'|'-1'} [index] - Foreground = 1, background = -1, default: 1
   * @returns {Promise}
   */
  clearLayer(index = 1) {
    return this.api.delete(`/rooms/${this.accessKey}/layers/${index}`)
  }

  /**
   * Start playback
   * @see https://docs.eyeson.com/docs/rest/references/playbacks
   * @param {object} options - Playback options
   * @returns {Promise}
   */
  startPlayback(options) {
    return this.api.post(`/rooms/${this.accessKey}/playbacks`, options)
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
