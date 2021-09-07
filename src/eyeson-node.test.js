
const client = require('./client')
const Eyeson = require('./eyeson-node')
jest.mock('./client')

const apiKey = 'api-key'
const eyeson = new Eyeson({ apiKey })

beforeEach(() => client.mockClear())

describe('join', () => {
  it('joins a meeting', async () => {
    const user = await eyeson.join('username')
    expect(user.accessKey).toEqual('access-key')
  })
})

describe('user.ready', () => {
  it('checks if a user is ready', async () => {
    const user = await eyeson.join('username')
    expect(user.ready).toBeTruthy()
  })

  it('provides a method to wait for a room to be ready', async () => {
    const user = await eyeson.join('username')
    await user.waitReady()
  })
})

describe('user.chat', () => {
  it('provides a method to send chat messages', async () => {
    const user = await eyeson.join('username')
    await user.chat('a chat message')
  })
})

describe('user.layer', () => {
  it('provides a method to set a layer', async () => {
    const user = await eyeson.join('username')
    await user.setLayer({ url: 'https://eyeson.com/background-image.png' })
  })

  it('provides a method to unset a layer', async () => {
    const user = await eyeson.join('username')
    await user.clearLayer(1)
  })
})

describe('user.playback', () => {
  it('provides a method to set a playback', async () => {
    const user = await eyeson.join('username')
    await user.startPlayback({ url: 'https://eyeson.com/video.mp4' })
  })
})

describe('user.layout', () => {
  it('provides a method to set a layout', async () => {
    const user = await eyeson.join('username')
    await user.setLayout({ 'show_names': false })
  })
})

describe('user.recording', () => {
  it('provides a method to start a recoding', async () => {
    const user = await eyeson.join('username')
    await user.startRecording()
  })

  it('provides a method to stop a recoding', async () => {
    const user = await eyeson.join('username')
    await user.stopRecording()
  })
})

describe('user.broadcast', () => {
  it('provides a method to start broadcasting', async () => {
    const user = await eyeson.join('username')
    await user.startBroadcast('https://eyeson.com/stream-url')
  })

  it('provides a method to stop broadcasting', async () => {
    const user = await eyeson.join('username')
    await user.stopBroadcast()
  })
})

describe('user.stop', () => {
  it('provides a method to stop a meeting', async () => {
    const user = await eyeson.join('username')
    await user.stopMeeting()
  })
})
