const https = require('node:https')
const FormData = require('form-data')
/// https://github.com/form-data/form-data

/**
 * Eyeson API provides communication with the video conferencing service.
 */
class Client {
  /**
   * @typedef {object} ClientOptions
   * @prop {string} hostname
   * @prop {string} [apiKey]
   */
  
  /**
   * @param {ClientOptions} clientOptions
   */
  constructor({ apiKey, hostname }) {
    this.options = { hostname, headers: { 'Content-Type': 'application/json' } }
    if (apiKey) {
      this.options.headers['Authorization'] = apiKey
    }
  }

  /** @private */
  _request(params, data) {
    return new Promise((resolve, reject) => {
      const requestOptions = Object.assign(params, this.options)
      if (data instanceof FormData) {
        requestOptions.headers = data.getHeaders()
      }
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
      if (data) {
        if (data instanceof FormData) {
          data.pipe(req)
        } else {
          req.write(JSON.stringify(data))
        }
      }
      req.end()
    })
  }
  /**
   * GET request
   * @param {string} path - API endpoint
   * @returns {Promise}
   */
  get(path) {
    return this._request({ path, method: 'get' })
  }

  /**
   * POST request
   * @param {string} path - API endpoint
   * @param {object} data - Payload
   * @returns {Promise}
   */
  post(path, data) {
    return this._request({ path, method: 'post' }, data)
  }

  /**
   * PUT request
   * @param {string} path - API endpoint
   * @param {object} data - Payload
   * @returns {Promise}
   */
  put(path, data) {
    return this._request({ path, method: 'put' }, data)
  }

  /**
   * DELETE request
   * @param {string} path - API endpoint
   * @returns {Promise}
   */
  delete(path) {
    return this._request({ path, method: 'delete' })
  }
}

module.exports = Client
