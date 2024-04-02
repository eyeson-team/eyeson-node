
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
await user.sendCustomMessage('custom', message)

// Create a snapshot
await user.snapshot()

// Lock meeting to prevent new participants
await user.lockMeeting()
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

### Layer creation

Since version 1.2.0, you can create and apply foreground or background layers by
simply programming them! It is based on the node canvas plugin from https://github.com/Brooooooklyn/canvas.

```js
import Eyeson from 'eyeson-node'
const eyeson = new Eyeson({ apiKey: '< api-key >' }) // configure to use your api key

const overlay = new Eyeson.Layer()
const font = 'bold 16px Arial, sans-serif'
const fontColor = '#fff'

overlay.addTextBox('Martin', font, fontColor, 640, 360, 'bottom right', 10, null, 4, '#0000007f')
overlay.addTextBox('Elisa', font, fontColor, 1280, 360, 'bottom right', 10, null, 4, '#0000007f')
overlay.addTextBox('Customer', font, fontColor, 640, 720, 'bottom right', 10, null, 4, '#0000007f')

const gradient = overlay.createLinearGradient(0, 400, 0, 600)
gradient.addColorStop(0, '#777')
gradient.addColorStop(200, '#555')

overlay.startShadow(7, 2, 2, '#555')
overlay.addMultilineTextBox('Agenda:\n \n- Test Eyeson\n- Try Layer', font, fontColor, 700, 400, 240, 200, 20, 22, 4, gradient, 'center')
overlay.endShadow()

const user = await eyeson.join(username)
await user.sendLayer(overlay)
```

You can just send local images:

```js
import Eyeson from 'eyeson-node'
import fsPromise from 'node:fs/promise'

const eyeson = new Eyeson({ apiKey: '< api-key >' }) // configure to use your api key
const user = await eyeson.join(username)
const imageBuffer = await fsPromise.readFile('./overlay.png')
await user.sendLayer(imageBuffer, 1, 'png')
// or as jpg:
const imageBuffer = await fsPromise.readFile('./overlay.jpg')
await user.sendLayer(imageBuffer, 1, 'jpg')
```

Here's a list of all Layer methods:

```ts
// Register font file with name
Eyeson.Layer.registerFont('./OpenSans.ttf', 'OpenSans'): boolean
const layer = new Eyeson.Layer({ widescreen: true }): Layer
const metrics = layer.measureText('text', 'bold 16px OpenSans'): TextMetrics
layer.createLinearGradient(x1, y1, x2, y2): CanvasGradient
layer.createRadialGradient(x1, y1, r1, x2, y2, r2): CanvasGradient
layer.createConicGradient(startAngle, x, y): CanvasGradient
// Set shadow that is applied to all following elements
layer.startShadow(blur, offsetX, offsetY, color): LayerObject
// End shadow, continue without shadow
layer.endShadow(): LayerObject
// add text
layer.addText(text, font, color, x, y, maxWidth = null): LayerObject
// add multiline text that breaks at the given width and prevent overflow on given height
layer.addMultilineText(text, font, color, x, y, width, height, lineHeight, textAlign = 'left'): LayerObject
// add image. path can be local or URL. set width and height to resize the image
await layer.addImage(path, x, y, width = null, height = null): Promise<LayerObject>
// add filled rectangle with border radius
layer.addRect(x, y, width, height, radius = 0, color): LayerObject
// add stroked rectangle with border radius
layer.addRectOutline(x, y, width, height, lineWidth = 1, radius = 0, color): LayerObject
// add filled circle
layer.addCircle(x, y, radius, color): LayerObject
// add stroked circle
layer.addCircleOutline(x, y, radius, lineWidth = 1, color): LayerObject
// add line
layer.addLine(x1, y1, x2, y2, lineWidth = 1, color): LayerObject
// add a filled polygon. points are alternating x, y coordinates
layer.addPolygon(color, ...points): LayerObject
// add a stroked polygon. points are alternating x, y coordinates
layer.addPolygonOutline(color, lineWidth = 1, ...points): LayerObject
// add text with a filled background box
layer.addTextBox(text, font, fontColor, x, y, origin = 'top left', padding = 0, maxWidth = null, radius = 0, color): LayerObject
// add text with a stroked box
layer.addTextBoxOutline(text, font, fontColor, x, y, origin = 'top left', padding = 0, maxWidth = null, radius = 0, lineWidth = 1, color): LayerObject
// add a filled box with multiline text that breaks at the given width and prevent overflow on given height
layer.addMultilineTextBox(text, font, fontColor, x, y, width, height, padding = 0, lineHeight, radius = 0, color, textAlign = 'left'): LayerObject
// add a stroked box with multiline text
layer.addMultilineTextBoxOutline(text, font, fontColor, x, y, width, height, padding = 0, lineHeight, radius = 0, lineWidth = 1, color, textAlign = 'left'): LayerObject
// draw canvas and create the image buffer
layer.createBuffer(): Buffer
// draw canvas and write to local file
await layer.writeFile(path: String): Promise<void>
```

For all methods, `color`, or `fontColor` can be CSS color value, e.g. '#000' or
'black' or with alpha 'rgb(0 0 0 / 10%)', or a previous generated gradient.

`textAlign` can be 'left', 'center', 'right', 'start', or 'end'.

`origin` can be 'top left', 'top center', 'top right', 'center left', 'center',
'center right', 'bottom left', 'bottom center', or 'bottom right'.

`padding` can be one number for all sides or an array of numbers. It supports
1, 2, 3, or 4 value notation.

All number values are in pixels.

The `LayerObject` is just an object containing `type` and all its settings. It's great for further delta updates.

```js
const user = eyeson.join(...)
const overlay = new Eyeson.Layer({ widescreen: true })
const timeEntry = overlay.addTextBox(new Date().toLocaleTimeString(), font, fontColor, x, y, origin, padding, maxWidth, radius, backgroundColor)
await user.sendLayer(overlay)
setTimeout(async () => {
    timeEntry.text = new Date().toLocaleTimeString()
    await user.sendLayer(overlay)
}, 60 * 1000) // update time every minute
```

## Development

```sh
$ npm install
$ npm run test -- --watch
$ npm run build
```

## Releases

- 1.2.0 New functions; Layer
- 1.1.0 Import/require; Type declaration; Meeting observer
- 1.0.0 Initial release
