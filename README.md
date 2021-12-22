
# eyeson-node JavaScript API Library

A nodejs library for the [eyeson](https://www.eyeson.com) api. It provides a
client that allows to easily build applications that can start and manage
eyeson video conferences.

A full API documentation including all features is available at
[eyeson-team.github.io/api/api-reference/](https://eyeson-team.github.io/api/api-reference/).

## Installation

Add eyeson-api to your JavaScript project using `npm` or `yarn`.

```sh
$ npm install --save eyeson-node
# or
$ yarn add eyeson-node
```

## Usage

Get an API-KEY from
[developers.eyeson.team/developer](https://developers.eyeson.team/developer).

```JavaScript
const Eyeson = require('eyeson-node');
const eyeson = new Eyeson({ apiKey: '< api-key >' }); // configure to use your api key
```

To create a new meeting join a room. Note: The string typed identifier `id`
represents which room to join. Users joining the same room-id will be
connected. If you do not specify an identifier, there will be a new meeting
created with every join request.

```js
const user = await eyeson.join(username, roomIdentifier, options)
// Ensure the user (and meeting) is ready
await user.waitReady()

// Send a message into meeting chat...
await user.chat("/me sends a message")
// Update Layers and Layout
await user.setLayer({ url })
await user.clearLayer(layerIndex)
await user.startPlayback({ url })
await user.setLayout({ layout: "auto", show_names: false })
// Start and Stop Recoding
await user.startRecording()
await user.stopRecording()
// Start and Stop Broadcast
await user.startBroadcast(streamUrl)
await user.stopBroadcast()
// Stop a meeting for all participants
await user.stopMeeting()
```

## Development

```sh
$ npm install
$ npm run test -- --watch
$ npm run watch
$ npm run build
```

## Releases

- 1.0.0 Initial release.
