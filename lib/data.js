/*
 * Library for storing and editing data
 *
 */

// Dependencies
const fs = require('fs')
const path = require('path')

// Container for the module (to be exported)
const lib = {}

lib.baseDir = path.join(__dirname, '/../.data/')

// Write data to a file
lib.create = function create(dir, file, data, callback) {
  // Open the file for writing (if it does not exist)
  fs.open(`${lib.baseDir}${dir}/${file}.json`, 'wx', function createFileOpen(
    err,
    fileDescriptor
  ) {
    if (!err && fileDescriptor) {
      // Convert data to string
      const stringData = JSON.stringify(data)

      // Write to file and close it.
      fs.writeFile(fileDescriptor, stringData, function createWriteFile(err) {
        if (!err) {
          fs.close(fileDescriptor, function createCloseFile(err) {
            if (!err) {
              callback(false)
            } else {
              callback('Error closing new file.')
            }
          })
        } else {
          callback('Error writing to new file.')
        }
      })
    } else {
      callback('Could not create new file. It may already exist.')
    }
  })
}

lib.read = function read(dir, file, callback) {
  fs.readFile(
    `${lib.baseDir}${dir}/${file}.json`,
    'utf8',
    function readReadfileCB(err, data) {
      callback(err, data)
    }
  )
}

// Update data inside a file
lib.update = function update(dir, file, data, callback) {
  fs.open(`${lib.baseDir}${dir}/${file}.json`, 'r+', function updateOpen(
    err,
    fileDescriptor
  ) {
    if (!err && fileDescriptor) {
      const stringData = JSON.stringify(data)

      // Truncate the file
      fs.ftruncate(fileDescriptor, err => {
        if (!err) {
          // Write to the file and close it.
          fs.writeFile(fileDescriptor, stringData, err => {
            if (!err) {
              fs.close(fileDescriptor, err => {
                if (!err) {
                  callback(false)
                } else {
                  callback('Error closing the file.')
                }
              })
            } else {
              callback('Error writing to existing file.')
            }
          })
        } else {
          callback('Error truncating file.')
        }
      })
    } else {
      callback('Could not open the file for updating. It may not exist yet.')
    }
  })
}

lib.delete = function deleteFile(dir, file, callback) {
  // Unlink the file
  fs.unlink(`${lib.baseDir}${dir}/${file}.json`, err => {
    if (!err) {
      callback(false)
    } else {
      callback('Error deleting file.')
    }
  })
}

module.exports = lib
