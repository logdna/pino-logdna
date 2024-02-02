'use strict'

const {once} = require('events')
const http = require('http')
const {parse} = require('querystring')

module.exports = function create(test) {
  const server = http.createServer((req, res) => {
    const parts = req.url.split('?')
    const query = parts[1] ? parse(parts[1]) : {}

    let data = ''
    req.on('data', (chunk) => {
      data += chunk
    })

    req.on('end', () => {
      test({
        body: JSON.parse(data)
      , query
      })
      res.writeHead(200)
      res.end()
    })
  })

  return {
    server
  , async listen(listen_port = 0) {
      server.listen(listen_port)
      await once(server, 'listening')

      const {port} = server.address()
      return `http://localhost:${port}`
    }
  , async close() {
      server.close()
      await once(server, 'close')
    }
  }
}
