console.log('index.js')
const keys = require('../cli_keys')

/*
* Primary file for the API
*
*/

// Depenedencies
const http = require('http')
const url = require('url')

// The server should respond to all requests witha string
const server = http.createServer((req, res) => {
  // Get the URL and parse it
  const parsedURL = url.parse(req.url, true)
  /**
   * Given the input: "localhost:3000/functional_path/?hi+there+merry_ann"
   * Object returns from parse:
   *  Url {
   *    protocol: null,
   *    slashes: null,
   *    auth: null,
   *    host: null,
   *    port: null,
   *    hostname: null,
   *    hash: null,
   *    search: '?hi+there+merry_ann',
   *    query: { 'hi there merry_ann': '' },
   *    pathname: '/',
   *    path: '/?hi+there+merry_ann',
   *    href: '/?hi+there+merry_ann'
   *  }
   */

  // Get the path from URL
  const path = parsedURL.pathname
  const trimmedPath = path.replace(/^\/+|\/+$/g, '')

  // Get the HTTP method
  const method = req.method.toLowerCase()

  // Send response

  // Log the requested path to log file and console
  console.log(` \x1b[33m${'Requested path: '} \x1b[32m${trimmedPath}\x1b[0m\n`)

  res.end('Hello world!\n')
})

// Start the server, and have it listen on port keys.PORT.
server.listen(keys.PORT, () => {
  nowListening(keys.PORT)
})

// Local function: pretty print server start & port.
const nowListening = port => {
  // Make entry in persistent log file when port started, and on what port.

  // Log info to console.
  console.log(
    `\x1b[32m${'\n\nThe server is now listening on port'} \x1b[31m${port}\x1b[32m${'.'}\x1b[0m\n`
  )
}
