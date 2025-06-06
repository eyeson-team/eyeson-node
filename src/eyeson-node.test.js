const client = require('./client')
const Eyeson = require('./eyeson-node')
jest.mock('./client')
jest.mock('form-data')

const apiKey = 'api-key'
const eyeson = new Eyeson({ apiKey })

beforeEach(() => client.mockClear())

describe('join', () => {
  it('joins a meeting', async () => {
    const user = await eyeson.join('username')
    expect(user.accessKey).toEqual('access-key')
  })
})

describe('user', () => {
  it('get user by access key', async () => {
    const user = await eyeson.getUser('access-key')
    expect(user.accessKey).toEqual('access-key')
  })
})

describe('guest', () => {
  it('register guest user with token', async () => {
    const user = await eyeson.registerGuest('username', 'guest-token')
    expect(user.accessKey).toEqual('access-key')
  })
})

describe('snapshots', () => {
  it('get snapshot data', async () => {
    const snapshot = await eyeson.getSnapshot('snapshot-id')
    expect(snapshot.id).toEqual('snapshot-id')
  })

  it('provides a method to delete snapshot', async () => {
    await eyeson.deleteSnapshot('snapshot-id')
  })

  it('provides a method to get all snapshots of a room', async () => {
    await eyeson.getRoomSnapshots('room-id')
  })
})

describe('recordings', () => {
  it('get recording data', async () => {
    const recording = await eyeson.getRecording('recording-id')
    expect(recording.id).toEqual('recording-id')
  })

  it('provides a method to delete recording', async () => {
    await eyeson.deleteRecording('recording-id')
  })

  it('provides a method to get all recordings of a room', async () => {
    await eyeson.getRoomRecordings('room-id')
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

  it('provides a method to send a layer from image buffer', async () => {
    const user = await eyeson.join('username')
    const layer = {
      createBuffer: jest.fn(() => null),
    };
    await user.sendLayer(layer)
    expect(layer.createBuffer).toHaveBeenCalledTimes(1)
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

  it('provides a method to stop a playback', async () => {
    const user = await eyeson.join('username')
    await user.stopPlayback('playback')
  })
})

describe('user.layout', () => {
  it('provides a method to set a layout', async () => {
    const user = await eyeson.join('username')
    await user.setLayout({ show_names: false })
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

describe('user.snapshot', () => {
  it('provides a method to create a snapshot', async () => {
    const user = await eyeson.join('username')
    await user.snapshot()
  })
})

describe('user.lock', () => {
  it('provides a method to lock a meeting', async () => {
    const user = await eyeson.join('username')
    await user.lockMeeting()
  })
})

describe('user.stop', () => {
  it('provides a method to stop a meeting', async () => {
    const user = await eyeson.join('username')
    await user.stopMeeting()
  })
})

describe('webhook', () => {
  it('provides a method to register a webhook', async () => {
    const webhook = await eyeson.registerWebhook('https://', 'room_update')
    expect(webhook.id).toEqual('webhook-id');
  })

  it('provides a method to clear webhook', async () => {
    await eyeson.clearWebhook()
  })
})
