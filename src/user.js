// A helper method to sleep/block.
const timer = ms => new Promise(resolve => setTimeout(resolve, ms))

// user wraps the meeting access and information, and provides methods to
// interact with a meeting.
module.exports = class {
  constructor(data, client) {
    this.data = data
    this.api = client
  }

  get accessKey() {
    return this.data['access_key']
  }

  get ready() {
    return this.data.ready
  }

  // Using async promise here to shorten the code a lot... ensuring everything
  // is in a try catch block is a must-have here.
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

  chat(content) {
    return this.api.post(`/rooms/${this.accessKey}/messages`, { type: 'chat', content })
  }

  startRecording() {
    return this.api.post(`/rooms/${this.accessKey}/recording`)
  }

  stopRecording() {
    return this.api.delete(`/rooms/${this.accessKey}/recording`)
  }

  startBroadcast(url) {
    return this.api.post(`/rooms/${this.accessKey}/broadcasts`, { 'stream_url': url })
  }

  stopBroadcast() {
    return this.api.delete(`/rooms/${this.accessKey}/broadcasts`)
  }

  setLayout(options) {
    return this.api.post(`/rooms/${this.accessKey}/layout`, options)
  }

  setLayer(options) {
    return this.api.post(`/rooms/${this.accessKey}/layers`, options)
  }

  clearLayer(index = 1) {
    return this.api.delete(`/rooms/${this.accessKey}/layers/${index}`)
  }

  startPlayback(options) {
    return this.api.post(`/rooms/${this.accessKey}/playbacks`, options)
  }

  stopMeeting() {
    return this.api.delete(`/rooms/${this.accessKey}`)
  }
}
