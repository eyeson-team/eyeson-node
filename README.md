
# eyeson-node JavaScript API Library

A NodeJS library for the [Eyeson](https://www.eyeson.com) API. It provides a
client that allows to easily build applications that can start and manage
eyeson video conferences.

A full API documentation including all features is available at
[docs.eyeson.com/docs/rest/intro/](https://docs.eyeson.com/docs/rest/intro/).

## Installation

Add eyeson-node to your JavaScript project using `npm` or `yarn`.

```sh
$ npm install --save eyeson-node
# or
$ yarn add eyeson-node
```

## Usage

Get an API-KEY from
[developers.eyeson.team](https://developers.eyeson.team).

```js
import Eyeson from 'eyeson-node';
const eyeson = new Eyeson({ apiKey: '< api-key >' }); // configure to use your api key
```

To create a new meeting join a room. Note: The string typed identifier `id`
represents which room to join. Users joining the same room-id will be
connected. If you do not specify an identifier, there will be a new meeting
created with every join request.

Read more about creating a new meeting https://docs.eyeson.com/docs/rest/references/room

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

### Meeting observer

Since version 1.1.0, eyeson-node has the meeting observer included. You can
read more about it here: https://docs.eyeson.com/docs/category/meeting-observer

```js
import Eyeson from 'eyeson-node';
const eyeson = new Eyeson({ apiKey: '< api-key >' }); // configure to use your api key

const meeting = await eyeson.join(username);

const connection = eyeson.observer.connect(meeting.roomId);
connection.on('event', event => {
    if (event.type === 'room_update') {
        console.log(event.content);
    }
    else if (event.type === 'chat') {
        console.log(event.content);
    }
    else if (event.type === 'participant_update') {
        console.log(event.participant);
    }
    // and many more
});
// ...later...
connection.close(); // closes automatically on shutdown
```

## Development

```sh
$ npm install
$ npm run test -- --watch
$ npm run build
```

## Releases

- 1.1.0 Import/require; Type declaration; Meeting observer
- 1.0.0 Initial release
