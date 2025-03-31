/**
 * Class RoomForward
 * @see https://docs.eyeson.com/docs/rest/references/forward
 */
class RoomForward {

  /**
   * @typedef {import('./client')} Client
   * @typedef {'audio'|'video'|'audio,video'|Array<'audio'|'video'>} ForwardType
   */

  /**
   * @param {Client} api
   * @param {string} room_id
   */
  constructor(api, room_id) {
    this.api = api
    this.room_id = room_id
  }

  /**
   * Forward meeting source
   * @param {string} forward_id - Custom, unique identifier
   * @param {string} user_id - Custom identifier for participants or video sources
   * @param {ForwardType} type - Forwarded audio/video channels
   * @param {string} url - The WHIP endpoint URL
   * @returns {Promise}
   */
  source(forward_id, user_id, type, url) {
    return this.api.post(`/rooms/${this.room_id}/forward/source`, {
      forward_id, user_id, type, url
    })
  }

  /**
   * Forward MCU One View
   * @param {string} forward_id - Custom, unique identifier
   * @param {ForwardType} type - Forwarded audio/video channels
   * @param {string} url - The WHIP endpoint URL
   * @returns {Promise}
   */
  mcu(forward_id, type, url) {
    return this.api.post(`/rooms/${this.room_id}/forward/mcu`, {
      forward_id, type, url
    })
  }

  /**
   * Forward meeting source
   * @param {string} forward_id - Custom, unique identifier
   * @param {string} play_id - Custom identifier for playbacks
   * @param {ForwardType} type - Forwarded audio/video channels
   * @param {string} url - The WHIP endpoint URL
   * @returns {Promise}
   */
  playback(forward_id, play_id, type, url) {
    return this.api.post(`/rooms/${this.room_id}/forward/playback`, {
      forward_id, play_id, type, url
    })
  }

  /**
   * Stop an active forward
   * @param {string} forward_id - Custom, unique identifier
   * @returns {Promise}
   */
  stop(forward_id) {
    return this.api.delete(`/rooms/${this.room_id}/forward/${forward_id}`)
  }
}

module.exports = RoomForward
