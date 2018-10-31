// Some temporary local variables
const r = '\x1b[31m'
const g = '\x1b[32m'
const y = '\x1b[33m'
const x = '\x1b[34m'
const reset = '\x1b[0m'

console.log('index.js')
const keys = require('../cli_keys')

/*
* Primary file for the API
*
*/

// Depenedencies
const http = require('http')
const url = require('url')
const StringDecoder = require('string_decoder').StringDecoder

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

  const queryStringObj = parsedURL.query

  // Get the path from URL
  const path = parsedURL.pathname
  const trimmedPath = path.replace(/^\/+|\/+$/g, '')

  // Get the HTTP method
  const method = req.method.toLowerCase()

  // Get the headers as an object
  const headers = req.headers

  // Get the payload, if any
  const decoder = new StringDecoder('utf-8')
  let buffer = ''

  // Log the requested path to log file and console
  console.log(`${y}Requested path: ${g}${trimmedPath}${y}
  method: ${g}${method}$`)
  console.log(`  ${r}QUERIES\n• ${y}KEY: ${g}VALUE`)
  Object.keys(queryStringObj).forEach(entry => {
    console.log(`  ${r}• ${y}${entry}: ${g}${queryStringObj[entry]}`)
  })
  console.log(`  ${r}HEADERS\n• ${y}KEY: ${g}VALUE`)
  Object.keys(headers).forEach(entry => {
    console.log(`  ${r}• ${y}${entry}: ${g}${headers[entry]}`)
  })

  req.on('data', data => {
    buffer += decoder.write(data)
  })

  req.on('end', () => {
    buffer += decoder.end()

    // Send response
    res.end('Hello world!\n')

    // Log the buffer to the console
    console.log(`  ${r}BUFFER`)
    console.log(`  ${r}• ${y}buffer: ${g}

${buffer}`)
  })
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
