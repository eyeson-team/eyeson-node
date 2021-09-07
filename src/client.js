const https = require('https');

// eyeson Api provides communication with the video conferencing service.
module.exports = class {
  constructor({ apiKey, hostname }) {
    this.options = { hostname, headers: { 'Content-Type': 'application/json' } }
    if (apiKey) {
      this.options.headers['Authorization'] = apiKey
    }
  }

  _request(params, data) {
    return new Promise((resolve, reject) => {
      const requestOptions = Object.assign(params, this.options)
      const req = https.request(requestOptions, res => {
        try {
          if (![200, 201, 204].includes(res.statusCode)) {
            reject(`API Request failed with ${res.statusCode}`)
          }
          let rawData = ''
          res.setEncoding('utf8')
          res.on('data', chunk => { rawData += chunk })
          res.on('end', () => resolve(rawData && JSON.parse(rawData)))
        } catch(err) {
          reject(err)
        }
      }).on('error', e => reject(`Got error: ${e.message}`))
      if (data) req.write(JSON.stringify(data))
      req.end()
    })
  }

  get(path) {
    return this._request({ path, method: 'get' })
  }

  post(path, data) {
    return this._request({ path, method: 'post' }, data)
  }

  put(path, data) {
    return this._request({ path, method: 'put' }, data)
  }

  delete(path) {
    return this._request({ path, method: 'delete' })
  }
}
