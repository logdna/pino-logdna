'use strict'

const {promisify} = require('util')
const os = require('os')
const {once} = require('events')
const {test} = require('tap')
const pino = require('pino')
const createTestServer = require('./common/test-server.js')
const timeout = promisify(setTimeout)

test('pinoLogdna', async (t) => {
  const key = 'testing'
  const oshost = os.hostname()

  t.test('defaults', async (t) => {
    let requests = 0
    const {listen, close} = createTestServer(({body, query}) => {
      requests++
      t.equal(body.e, 'ls', 'event matches')
      t.equal(body.ls.length, 1, 'number of logs matches')
      t.match(body.ls, [
        {
          line: 'test'
        , level: 'INFO'
        , app: 'default'
        , timestamp: Number
        }
      ], 'line payload content matches')
      t.equal(
        body.ls[0].meta
      , `{"pid":${process.pid},"foo":"bar","hostname":"test.local"}`
      , 'unindexed meta contains expected properties'
      )
      t.ok(query.now, 'timestamp present in query')
      t.equal(query.hostname, oshost, 'os.hostname present in query')
    })

    const url = await listen(0)
    const transport = pino.transport({
      targets: [{
        target: '../lib/stream.js'
      , options: {
          key
        , url
        }
      }]
    })

    t.teardown(async () => {
      transport.end()
      await close()
    })

    const log = pino(transport)
    await once(transport, 'ready')

    log.info({foo: 'bar', hostname: 'test.local'}, 'test')
    await timeout(2000)
    t.equal(requests, 1, 'one request sent')
  })

  t.test('with options', async (t) => {
    const opts = {
      key
    , app: 'test-app'
    , env: 'test-env'
    , mac: 'FF:E4:E6:EF:CE:57'
    , ip: '10.0.0.1'
    , hostname: 'test.local'
    , tags: 'foo,bar'
    , indexMeta: true
    , messageKey: 'message'
    }

    let requests = 0
    const {listen, close} = createTestServer(({body, query}) => {
      requests++
      t.ok(query.now, 'timestamp present in query')
      t.equal(query.hostname, opts.hostname, 'hostname matches supplied option')
      t.equal(query.ip, opts.ip, 'ip matches supplied option')
      t.equal(query.mac, opts.mac, 'mac matches supplied option')
      t.equal(query.tags, opts.tags, 'tags match supplied option')
      t.equal(body.e, 'ls', 'event matches')
      t.equal(body.ls.length, 3, 'number of logs matches')
      t.match(body.ls, [
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
    })

    const url = await listen(0)
    const transport = pino.transport({
      targets: [{
        target: '../lib/stream.js'
      , options: {
          ...opts
        , url
        }
      }]
    })

    t.teardown(async () => {
      transport.end()
      await close()
    })

    const log = pino({messageKey: 'message'}, transport)
    await once(transport, 'ready')

    log.info('one')
    log.info({foo: 'bar'}, 'two')
    log.error({
      err: new Error('Fail')
    }, 'three')

    await timeout(2000)
    t.equal(requests, 1, 'one request sent')
  })

  t.test('data logs get sent correctly', async (t) => {
    t.plan(6)

    const {listen, close} = createTestServer(({body, query}) => {
      t.equal(body.e, 'ls', 'event matches')
      t.equal(body.ls.length, 1, 'number of logs matches')
      t.match(body.ls, [
        {
          line: '<data log>'
        , level: 'INFO'
        , app: 'default'
        , timestamp: Number
        }
      ], 'line payload content matches')
      t.equal(
        body.ls[0].meta
      , `{"pid":${process.pid},"foo":"bar","hostname":"${oshost}"}`
      , 'unindexed meta contains expected properties'
      )
      t.ok(query.now, 'timestamp present in query')
      t.equal(query.hostname, oshost, 'os.hostname present in query')
    })

    const url = await listen(0)
    const transport = pino.transport({
      targets: [{
        target: '../lib/stream.js'
      , options: {
          key
        , url
        }
      }]
    })

    t.teardown(async () => {
      transport.end()
      await close()
    })

    const log = pino(transport)
    await once(transport, 'ready')

    log.info({foo: 'bar'})
    await timeout(2000)
  })

  t.test('data logs support custom empty message', async (t) => {
    t.plan(6)

    const {listen, close} = createTestServer(({body, query}) => {
      t.equal(body.e, 'ls', 'event matches')
      t.equal(body.ls.length, 1, 'number of logs matches')
      t.match(body.ls, [
        {
          line: '<json log>'
        , level: 'INFO'
        , app: 'default'
        , timestamp: Number
        }
      ], 'line payload content matches')
      t.equal(
        body.ls[0].meta
      , `{"pid":${process.pid},"foo":"bar","hostname":"${oshost}"}`
      , 'unindexed meta contains expected properties'
      )
      t.ok(query.now, 'timestamp present in query')
      t.equal(query.hostname, oshost, 'os.hostname present in query')
    })

    const url = await listen(0)
    const transport = pino.transport({
      targets: [{
        target: '../lib/stream.js'
      , options: {
          emptyMessage: '<json log>'
        , key
        , url
        }
      }]
    })

    t.teardown(async () => {
      transport.end()
      await close()
    })

    const log = pino(transport)
    await once(transport, 'ready')

    log.info({foo: 'bar'})
    await timeout(2000)
  })
})
