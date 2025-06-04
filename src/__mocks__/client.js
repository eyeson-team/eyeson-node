
const mockRoom = {
  ready: true,
  access_key: 'access-key',
  links: { 'guest_join': 'https://guest-link/' },
  user: { id: 'user-id' }
}

const mockSnapshot = {
  id: 'snapshot-id',
}

const mockRecording = {
  id: 'recording-id',
}

const mockWebhook = {
  id: 'webhook-id',
}

const mockResponses = {
  post: {
    '/rooms': mockRoom,
    '/rooms/access-key/broadcasts': {},
    '/rooms/access-key/layers': {},
    '/rooms/access-key/layout': {},
    '/rooms/access-key/messages': {},
    '/rooms/access-key/playbacks': {},
    '/rooms/access-key/recording': {},
    '/rooms/access-key/snapshot': {},
    '/rooms/access-key/lock': {},
    '/guests/guest-token': mockRoom,
    '/webhooks': {},
  },
  get: {
    '/rooms/access-key': mockRoom,
    '/rooms/room-id/snapshots': [],
    '/rooms/room-id/recordings': [],
    '/snapshots/snapshot-id': mockSnapshot,
    '/recordings/recording-id': mockRecording,
    '/webhooks': mockWebhook,
  }
}

const mockGet = jest.fn().mockImplementation((path) => {
  if (!(path in mockResponses.get)) {
    throw `Missing ${path} in GET mock responses`
  }
  return new Promise(resolve => resolve(mockResponses.get[path]))
})

// NOTE: params is not checked...
const mockPost = jest.fn().mockImplementation((path) => {
  if (!(path in mockResponses.post)) {
    throw `Missing ${path} in POST mock responses`
  }
  return new Promise(resolve => resolve(mockResponses.post[path]))
})

const mock = jest.fn().mockImplementation(() => {
  return {
    get: mockGet,
    post: mockPost,
    put: () => {},
    delete: () => {},
  }
})

module.exports = mock
