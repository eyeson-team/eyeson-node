const http = require('http')
const port = process.env.PORT || 8201
const Eyeson = require('../src/eyeson-node')

/**
 * Start with API_KEY=... node examples/meeting-forward-server.js and
 *   access a recording via http://localhost:8201/<room-identifier>
 **/
const eyeson = new Eyeson({ apiKey: process.env.API_KEY })

const requestHandler = async (request, response) => {
  const id = request.url.split('/').reverse()[0]
  if (id === 'favicon.ico') {
    return response.end()
  }
  console.log('Forward user to meeting: ' + id)

  try {
    const user = await eyeson.join('eyeson-node-demo', id)
    console.debug(user.data.links)
    response.writeHead(302, { 'Location': user.data.links.gui });
    response.end();
  } catch(err) {
		response.end('Could not start a meeting: ' + err);
  }
}

const server = http.createServer(requestHandler)

server.listen(port, (err) => {
  if (err) {
    return console.error('Could not start server: ', err)
  }
  console.log(`Server is up and listening on ${port}`)
})
