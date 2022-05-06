'use strict'

const {Writable} = require('stream')
const build = require('pino-abstract-transport')
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
  const {
    key
  , onError
  , messageKey = 'msg'
  , emptyMessage = '<data log>'
  , ...logger_opts
  } = options

  const logger = createLogger(key, {
    ...logger_opts
  , UserAgent: `${pkg.name}/${pkg.version}`
  })

  if (onError) logger.on('error', onError)

  const logger_stream = new Writable({
    objectMode: true
  , autoDestroy: true
  , write(chunk, _, cb) {
      const {
        [messageKey]: message
      , name: app
      , time: timestamp
      , level
      , hostname
      , ...meta
      } = chunk

      const opts = {
        level: LEVEL_MAP.get(level) || level
      , app
      , meta: {
          ...meta
        , hostname
        }
      , timestamp
      }

      logger.log(message || emptyMessage, opts)
      cb(null)
    }
  , destroy(err, cb) {
      logger.on('cleared', () => {
        cb(err, null)
      })
      logger.flush()
    }
  })

  return build((source) => {
    source.pipe(logger_stream)
  }, {
    close(err, cb) {
      logger_stream.once('close', cb.bind(null, err))
      logger_stream.end()
    }
  })
}
