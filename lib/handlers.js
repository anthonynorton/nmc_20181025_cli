/*
 * Request handlers
 */

// Dependencies

// Define the routes
const handlers = {}

// Sample handler
handlers.sample = function(data, callback) {
  // Callback an HTTP status code, and a payload object
  callback(406, { name: 'sample handler', })
}

// Ping handler
handlers.ping = function(data, callback) {
  callback(200)
}

handlers.notFound = function(data, callback) {
  callback(404)
}

module.exports = handlers
