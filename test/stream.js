'use strict'

const os = require('os')
const {test} = require('tap')
const nock = require('nock')
const pino = require('pino')
const pinoLogdna = require('../lib/stream.js')

nock.disableNetConnect()

test('pinoLogdna', async (t) => {
  const key = 'testing'
  const url = 'http://example.org'
  const oshost = os.hostname()

  t.test('defaults', (t) => {
    const transport = pinoLogdna({key, url})
    const log = pino({}, transport)

    const scope = nock(url)
      .post('/', ({e, ls}) => {
        t.strictEqual(e, 'ls', 'event matches')
        t.strictEqual(ls.length, 1, 'number of logs matches')
        t.match(ls, [
          {
            line: 'test'
          , level: 'INFO'
          , app: 'default'
          , timestamp: Number
          }
        ], 'line payload content matches')
        t.strictEqual(
          ls[0].meta
        , `{"pid":${process.pid},"foo":"bar","hostname":"test.local"}`
        , 'unindexed meta contains expected properties')

        return true
      })
      .query((qs) => {
        t.ok(qs.now, 'timestamp present in query')
        t.strictEqual(qs.hostname, oshost, 'os.hostname present in query')
        return true
      })
      .reply(200, 'done')

    scope.on('replied', () => {
      t.end()
    })

    log.info({foo: 'bar', hostname: 'test.local'}, 'test')
  })

  t.test('with options', (t) => {
    const opts = {
      key
    , url
    , app: 'test-app'
    , env: 'test-env'
    , mac: 'FF:E4:E6:EF:CE:57'
    , ip: '10.0.0.1'
    , hostname: 'test.local'
    , tags: 'foo,bar'
    , indexMeta: true
    , messageKey: 'message'
    }
    const transport = pinoLogdna(opts)
    const log = pino({messageKey: opts.messageKey}, transport)

    const scope = nock(url)
      .post('/', ({e, ls}) => {
        t.strictEqual(e, 'ls', 'event matches')
        t.strictEqual(ls.length, 3, 'number of logs matches')
        t.match(ls, [
          {
            line: 'one'
          , level: 'INFO'
          , app: 'test-app'
          , env: 'test-env'
          , timestamp: Number
          , meta: {
              pid: process.pid
            , hostname: oshost
            }
          }
        , {
            line: 'two'
          , level: 'INFO'
          , app: 'test-app'
          , env: 'test-env'
          , timestamp: Number
          , meta: {
              foo: 'bar'
            , pid: process.pid
            , hostname: oshost
            }
          }
        , {
            line: 'three'
          , level: 'ERROR'
          , app: 'test-app'
          , env: 'test-env'
          , timestamp: Number
          , meta: {
              pid: process.pid
            , hostname: oshost
            , err: {
                type: 'Error'
              , message: 'Fail'
              , stack: String
              }
            }
          }
        ], 'line payload content matches')

        return true
      })
      .query((qs) => {
        t.ok(qs.now, 'timestamp present in query')
        t.strictEqual(qs.hostname, opts.hostname, 'hostname matches supplied option')
        t.strictEqual(qs.ip, opts.ip, 'ip matches supplied option')
        t.strictEqual(qs.mac, opts.mac, 'mac matches supplied option')
        t.strictEqual(qs.tags, opts.tags, 'tags match supplied option')
        return true
      })
      .reply(200, 'done')

    scope.on('replied', () => {
      t.end()
    })

    log.info('one')
    log.info({foo: 'bar'}, 'two')
    log.error({
      err: new Error('Fail')
    , message: 'three'
    })
  })

  t.test('flushes on stream close', (t) => {
    const transport = pinoLogdna({
      key
    , url
    // extend timeout so logger does not auto-flush
    , flushIntervalMs: 10000
    })
    const log = pino({}, transport)

    nock(url)
      .post('/', () => {
        return true
      })
      .query((qs) => {
        return true
      })
      .reply(200, 'done')

    log.info('one')
    transport.on('finish', () => {
      t.end()
    })
    transport.end()
  })
})
