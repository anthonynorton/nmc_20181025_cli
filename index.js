console.log('index.js')
const keys = require('../cli_keys')

/*
* Primary file for the API
*
*/

// Depenedencies
const http = require('http')

// The server should respond to all requests witha string
const server = http.createServer((req, res) => {
  res.end('Hello world!\n')
})

// Start the server, and have it listen on port keys.PORT.
server.listen(keys.PORT, () => {
  console.log(`The server is now listening on port ${keys.PORT}.`)
})
