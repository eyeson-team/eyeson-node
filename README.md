
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
import Eyeson from 'eyeson-node'
const eyeson = new Eyeson({ apiKey: '< api-key >' }) // configure to use your api key
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

// Start a playback
await user.startPlayback({ url })

// Set a layout
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

Discover new functions:

```js
// Snapshot info and delete
const snapshotInfo = await eyeson.getSnapshot(snapshotId)
const snapshots = await eyeson.getRoomSnapshots(roomId, page, startedAt)
await eyeson.deleteSnapshot(snapshotId)

// Recording info and delete
const recordingInfo = await eyeson.getRecording(recordingId)
const recordings = await eyeson.getRoomRecordings(roomId, page, startedAt)
await eyeson.deleteRecording(recordingId)

// Get user object after join
const user = await eyeson.getUser(accessKey)

// Register a guest user
const guest = await eyeson.registerGuest(username, guestToken, options)

// Start and stop a playback
await user.startPlayback({ play_id, url })
await user.stopPlayback(play_id)

// Send a custom message
await user.sendCustomMessage(message)

// Create a snapshot
await user.snapshot()

// Lock meeting to prevent new participants
await user.lockMeeting()
```

### Layer updates

You can send local images:

```js
import Eyeson from 'eyeson-node'
import fsPromise from 'node:fs/promise'

const eyeson = new Eyeson({ apiKey: '< api-key >' }) // configure to use your api key
const user = await eyeson.join(username)
const imageBuffer = await fsPromise.readFile('./overlay.png')
await user.sendLayer(imageBuffer, 1)
// or as jpg:
const imageBuffer = await fsPromise.readFile('./overlay.jpg')
await user.sendLayer(imageBuffer, 1)
// add an ID to check when it can be seen
await user.sendLayer(imageBuffer, 1, 'overlay-jpg')
```

Using the new [eyeson-node-layer](https://github.com/eyeson-team/eyeson-node-layer) plugin you can create and send layers with ease.

```js
import Eyeson from 'eyeson-node'
import EyesonLayer from 'eyeson-node-layer'

const user = eyeson.join('< username >', '< room id >', { options: { widescreen: true } })
const overlay = new EyesonLayer({ widescreen: true })
const timeEntry = overlay.addTextBox(new Date().toLocaleTimeString(), font, fontColor, x, y, origin, padding, maxWidth, radius, backgroundColor)
await user.sendLayer(overlay)
setTimeout(async () => {
    timeEntry.text = new Date().toLocaleTimeString()
    await user.sendLayer(overlay)
}, 60 * 1000) // update time every minute
```

### Meeting observer

Since version 1.1.0, eyeson-node has the meeting observer included. You can
read more about it here: https://docs.eyeson.com/docs/category/meeting-observer

```js
import Eyeson from 'eyeson-node'
const eyeson = new Eyeson({ apiKey: '< api-key >' }) // configure to use your api key

const meeting = await eyeson.join(username)

const connection = eyeson.observer.connect(meeting.roomId)
connection.on('event', event => {
    if (event.type === 'room_update') {
        console.log(event.content)
    }
    else if (event.type === 'chat') {
        console.log(event.content)
    }
    else if (event.type === 'participant_update') {
        console.log(event.participant)
    }
    // and many more
})
// ...later...
connection.close() // closes automatically on shutdown
```

### Permalink API

Since version 1.3.0, eyeson-node includes functions to use with Permalink API.
You can read more about it here: https://docs.eyeson.com/docs/rest/features/permalink

```js
import Eyeson from 'eyeson-node'
const eyeson = new Eyeson({ apiKey: '< api-key >' }) // configure to use your api key

const permalink = await eyeson.permalink.create('<username>', {
    name: '<room_name>',
    user: { id: '<user-id>' },
    options: { widescreen: true },
})
console.log(permalink.userToken, permalink.guestToken, permalink.data.links.gui, permalink.data.links.guest_join)

const list = await eyeson.permalink.getAll({ limit: 50, expired: false })

const permalink = await eyeson.permalink.getbyId('<permalink-id>') // can also be used to update "permalink.started"

const permalink = await eyeson.permalink.update('<permalink-id>', { options: { widescreen: false } })

await eyeson.permalink.delete('<permalink-id>')

const permalink = await eyeson.permalink.addUser('<permalink-id>', '<username>', { id: '<user-id>' })
console.log(permalink.userToken, permalink.data.links.gui)

await eyeson.permalink.removeUser('<permalink-id>', '<user-token>')

const user = await eyeson.permalink.joinMeeting('<user-token>')

const guest = await eyeson.permalink.registerGuest('<username>', '<guest-token>', { id: '<user-id>' }) // works only if permalink.started === true
```

## Development

```sh
$ npm install
$ npm run test -- --watch
$ npm run build
```

## Releases

- 1.3.2 update type declarations
- 1.3.1 sendLayer: imageType only needed with EyesonLayer
- 1.3.0 New: Permalink API
- 1.2.1 sendLayer: add layer id parameter
- 1.2.0 New functions; Layer updates
- 1.1.0 Import/require; Type declaration; Meeting observer
- 1.0.0 Initial release
