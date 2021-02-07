'use strict'

const {Writable} = require('stream')
const split = require('split2')
const pumpify = require('pumpify')
const {createLogger} = require('@logdna/logger')
const pkg = require('../package.json')

const LEVEL_MAP = new Map([
  [10, 'TRACE']
, [20, 'DEBUG']
, [30, 'INFO']
, [40, 'WARN']
, [50, 'ERROR']
, [60, 'FATAL']
])

module.exports = logdnaStream

function logdnaStream(options) {
  const {key, onError, ...loggerOpts} = options
  const logger = createLogger(key, {
    ...loggerOpts
  , UserAgent: `${pkg.name}/${pkg.version}`
  })

  if (onError) logger.on('error', onError)

  return pumpify(
    jsonStream()
  , logStream(logger, options)
  )
}

function jsonStream() {
  return split((str) => {
    try {
      return JSON.parse(str)
    } catch {
      return
    }
  })
}

function logStream(logger, options) {
  const {
    messageKey = 'msg'
  } = options

  return new Writable({
    objectMode: true
  , write(log, _, callback) {
      const {
        [messageKey]: message
      , name: app
      , time: timestamp
      , level
      , hostname
      , ...meta
      } = log

      const opts = {
        level: LEVEL_MAP.get(level) || level
      , app
      , meta: {
          ...meta
        , hostname
        }
      , timestamp
      }

      logger.log(message, opts)
      callback(null)
    }

  , final(callback) {
      logger.on('cleared', () => {
        callback()
      })
      logger.flush()
    }
  })
}
