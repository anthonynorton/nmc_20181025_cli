// Some temporary local variables
const r = '\x1b[31m'
const g = '\x1b[32m'
const y = '\x1b[33m'
const x = '\x1b[34m'
const reset = '\x1b[0m'

console.log('index.js')

/*
 * Primary file for the API
 *
 */

// Depenedencies
const http = require('http')
const https = require('https')
const url = require('url')
const StringDecoder = require('string_decoder').StringDecoder
const config = require('./config')
const fs = require('fs')

// The server should respond to all requests witha string
const httpServer = http.createServer((req, res) => {
  unifiedServer(req, res)
})

// Start the HTTP server.
httpServer.listen(config.httpPort, () => {
  console.log(`config.httpPort\x1b[33m ${config.httpPort}\x1b[0m`)
  nowListening(config.httpPort)
})

const httpsServerOptions = {
  key: fs.readFileSync('./https/key.pem'),
  cert: fs.readFileSync('./https/cert.pem'),
}

const httpsServer = https.createServer(httpsServerOptions, function httpsServer(
  req,
  res
) {
  unifiedServer(req, res)
})

// Start the HTTPS server.
httpsServer.listen(config.httpsPort, () => {
  console.log(`config.httpPort\x1b[33m ${config.httpsPort}\x1b[0m`)
  nowListening(config.httpsPort)
})

// All the server logic for both the HTTP and HTTPS servers
const unifiedServer = function unifiedServer(req, res) {
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

  // req.on('end'... will be called regardless of whether or not there is a
  // payload.
  req.on('end', () => {
    buffer += decoder.end()

    // Choose the handler this request should go to. If not found, use not found handler
    const chosenHandler = router.has(trimmedPath)
      ? router.get(trimmedPath)
      : router.get('notFound')

    // Construct the data to send to the handler
    const data = {
      trimmedPath,
      queryStringObj,
      headers,
      method,
      payload: buffer,
    }

    // Router the request to the handler specified in the router
    chosenHandler(data, (statusCode, payload) => {
      // Use the status code called back by the handler or default to 200
      statusCode = typeof statusCode === 'number' ? statusCode : 200

      // Use the payload called back by the handler, or default to an empty object
      payload = typeof payload === 'object' ? payload : {}

      // Covnert the payload to a string
      const payloadString = JSON.stringify(payload)

      // Return the response.
      res.setHeader('Content-Type', 'application/json')
      res.writeHead(statusCode) //
      res.end(payloadString)

      // Log the buffer to the console
      console.log(`  ${r}BUFFER`)
      console.log(`  ${r}• ${y}buffer: ${g}

${buffer}`)
    })
  })
}

// Local function: pretty print server start & port.
const nowListening = port => {
  console.log(`port: \x1b[33m${port}\x1b[0m`)
  // Make entry in persistent log file when port started, and on what port.

  // Log info to console.
  console.log(
    `\x1b[32m${'\n\nThe server is now listening on port'} \x1b[31m${port}\x1b[32m${'.'}\x1b[0m\n`
  )
}

// Define the router handlers
const handlers = {}

// Sample handler
handlers.sample = function(data, callback) {
  // Callback an HTTP status code, and a payload object
  callback(406, { name: 'sample handler', })
}

handlers.notFound = function(data, callback) {
  callback(404)
}

// Define a request router
const router = new Map([
  ['sample', handlers.sample,],
  ['notFound', handlers.notFound,],
])
