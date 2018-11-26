/**
 * Create and export configuration variables
 */

// Container for all the environments
const environments = new Map()
const DEFAULT = 'staging'

console.log('\x1b[32mRUNNING\x1b[0m')

// Staging (default) environment
environments.set('staging', {
  httpPort: 3000,
  httpsPort: 3001,
  envName: 'staging',
})

// Staging (default) environment
environments.set('production', {
  httpPort: 5000,
  httpsPort: 5001,
  envName: 'production',
})

// Determine which environment was passed as a command-line argument
const currentEnvironment =
  typeof process.env.NODE_ENV === 'string'
    ? process.env.NODE_ENV.toLowerCase()
    : ''

// Check that the current environment is one of the environments above, otherwise use defaults
const environmentToExport = environments.has(currentEnvironment)
  ? environments.get(currentEnvironment)
  : environments.get(DEFAULT)

module.exports = environmentToExport
