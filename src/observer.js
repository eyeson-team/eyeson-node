const WebSocket = require('ws')
const EventEmitter = require('node:events')
// @anycable/core is imported dynamically

// https://github.com/anycable/anycable-client#usage-nodejs

/**
 * Observer room/meeting connection, extends EventEmitter
 * emits connected, disconnected, event events
 * @extends EventEmitter
 */
class ObserverConnection extends EventEmitter {
  /**
   * @param {string} url
   * @param {object} [websocketOptions] - pass additional connection options supported by ws
   */
  constructor(url, websocketOptions) {
    super()
    this.state = 'init'
    this.ready = false
    /** @private */
    this._cable = null
    this._init(url, websocketOptions)
  }
  /** @private */
  async _init(url, websocketOptions) {
    const { createCable } = await import('@anycable/core')
    this._cable = createCable(url, {
      websocketImplementation: WebSocket,
      websocketOptions,
    })
    const channel = this._cable.subscribeTo('RoomChannel')
    channel.on('connect', () => this._onConnected())
    channel.on('disconnect', ({ reason }) => this._onDisconnected(reason))
    channel.on('message', message => this._onMessage(message))
  }
  /** @private */
  _onConnected() {
    this.state = 'connected'
    this.emit('connected')
  }
  /** @private */
  _onDisconnected(reason) {
    this.state = 'disconnected'
    this.emit('disconnected', reason)
    if (reason === 'unauthorized') {
      this.close()
    }
  }
  /** @private */
  _onMessage(message) {
    const { type } = message
    this.emit('event', message)
    if (type === 'room_update') {
      if (message.content.ready === true && !this.ready) {
        this.ready = true
      }
      if (message.content.shutdown === true && this.ready) {
        this.ready = false
        this.close()
      }
    }
  }
  /**
   * Close connection
   */
  close() {
    this.ready = false
    if (this._cable) {
      this._cable.disconnect()
    }
  }
}

class Observer {
  /**
   * @typedef {object} ObserverOptions
   * @prop {string} hostname
   * @prop {string} apiKey
   */

  /**
   * @param {ObserverOptions} observerOptions
   */
  constructor({ hostname, apiKey }) {
    this.url = `https://${hostname}/rt?room_id=`
    this.options = { headers: { 'Authorization': apiKey } }
  }
  /**
   * Create new connection to a room/meeting
   * @param {string} roomId - Specific room/meeting identifier
   * @returns {ObserverConnection}
   */
  connect(roomId) {
    const url = this.url + roomId
    return new ObserverConnection(url, this.options)
  }
}

module.exports = { Observer, ObserverConnection }
