
const mockRoom = {
  ready: true,
  'access_key': 'access-key',
  links: { 'guest_join': 'https://guest-link/' },
  user: { id: 'user-id' }
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
  },
  get: {
    '/rooms/access-key': mockRoom,
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

module.exports = mock;
