'use strict'

const http = require('http')
const path = require('path')
const fs = require('fs')
const {test} = require('tap')
const execa = require('execa')
const pkg = require('../package.json')

const ROOT = path.join(__dirname, '..')
const BIN = path.join(ROOT, 'bin')
const usage = fs.readFileSync(path.join(BIN, 'usage.txt'), 'utf8')
const logs = fs.readFileSync(path.join(__dirname, 'fixtures', 'logs'), 'utf8')
const cli = path.join(BIN, 'cli.js')

test('cli', async (t) => {
  t.test('exports', async (t) => {
    const exports = require(cli)
    t.type(exports, 'function', 'exports function')
    t.strictEqual(exports.name, 'main', 'exports main function')
  })

  t.test('error on missing ingestion key', async (t) => {
    const run = execa(cli, [])
    try {
      await run
    } catch (err) {
      t.notStrictEqual(err.exitCode, 0, 'non-zero exit code')
      t.match(err.message, /missing logdna key/i, 'output includes message')
    }
  })

  t.test('error on invalid option types', async (t) => {
    const run = execa(cli, [
      '--key', 'abc123'
    , '--url', 'invalid-url'
    , '-T', 'invalid-timeout'
    ])
    try {
      await run
    } catch (err) {
      t.notStrictEqual(err.exitCode, 0, 'non-zero exit code')
      t.match(err.message, /error: invalid options/i, 'output includes error message')
      t.match(
        err.message
      , "invalid: [ [ 'url', 'invalid-url' ], [ 'timeout', 'invalid-timeout' ]"
      , 'error includes list of invalid options')
    }
  })

  t.test('prints version', async (t) => {
    const {stdout} = await execa(cli, ['-v'])
    t.strictEqual(stdout, pkg.version, 'version output')
  })

  t.test('prints help', async (t) => {
    const {stdout} = await execa(cli, ['--help'])
    t.strictEqual(stdout.trim(), usage.trim(), 'usage output')
  })

  t.test('streams logs from stdin', async (t) => {
    const server = http.createServer((req, res) => {
      t.match(
        req.url
      , /^\/\?now=\d{13}&hostname=test\.local&mac=&ip=10.0.0.1&tags=foo%2Cbar$/
      )
      let data = ''
      req.on('data', (chunk) => {
        data += chunk.toString()
      })
      req.on('end', () => {
        const {e, ls} = JSON.parse(data)
        t.strictEqual(e, 'ls', 'event matches')
        t.strictEqual(ls.length, 7, 'number of logs matches')
        t.match(ls, [
          {
            timestamp: Number
          , line: 'hello world'
          , level: 'INFO'
          , app: 'default'
          , meta: {
              pid: 34442
            , hostname: 'logs.local'
            }
          }
        , {
            timestamp: Number
          , line: 'this is at error level'
          , level: 'ERROR'
          , app: 'default'
          , meta: {
              pid: 34442
            , hostname: 'logs.local'
            }
          }
        , {
            timestamp: Number
          , line: 'the answer is 42'
          , level: 'INFO'
          , app: 'default'
          , meta: {
              pid: 34442
            , hostname: 'logs.local'
            }
          }
        , {
            timestamp: Number
          , line: 'hello world'
          , level: 'INFO'
          , app: 'default'
          , meta: {
              pid: 34442
            , obj: 42
            , hostname: 'logs.local'
            }
          }
        , {
            timestamp: Number
          , line: 'no timestamp or level'
          , level: 'INFO'
          , app: 'default'
          , meta: {
              pid: 34442
            , hostname: 'logs.local'
            }
          }
        , {
            timestamp: Number
          , line: 'hello world with an invalid level'
          , level: 'INFO'
          , app: 'default'
          , meta: {
              pid: 34442
            , obj: 42
            , b: 2
            , hostname: 'logs.local'
            }
          }
        , {
            timestamp: Number
          , line: 'an error'
          , level: 'ERROR'
          , app: 'default'
          , meta: {
              pid: 34442
            , hostname: 'logs.local'
            , type: 'Error'
              /* eslint-disable max-len */
            , stack: 'Error: an error\n'
                + '    at Object.<anonymous> (/home/test/code/pino-logdna/example.js:14:12)\n'
                + '    at Module._compile (internal/modules/cjs/loader.js:1063:30)\n'
                + '    at Object.Module._extensions..js (internal/modules/cjs/loader.js:1092:10)\n'
                + '    at Module.load (internal/modules/cjs/loader.js:928:32)\n'
                + '    at Function.Module._load (internal/modules/cjs/loader.js:769:14)\n'
                + '    at Function.executeUserEntryPoint [as runMain] (internal/modules/run_main.js:72:12)\n'
                + '    at internal/main/run_main_module.js:17:47'
              /* eslint-enable max-len */
            }
          }
        ])

        res.writeHead(200)
        res.end()
      })
    }).listen(0)

    t.tearDown(async () => {
      server.close()
    })

    const {port} = server.address()
    const url = `http://0.0.0.0:${port}`
    const stdin = fs.createReadStream(path.join(__dirname, 'fixtures', 'logs'))
    const args = [
      '--key', 'abc123'
    , '--url', url
    , '--index-meta', true
    , '--hostname', 'test.local'
    , '--ip', '10.0.0.1'
    , '--tag', 'foo'
    , '--tag', 'bar'
    ]
    const opts = {
      input: stdin
    }

    const {stdout} = await execa(cli, args, opts)
    t.strictEqual(stdout.trim(), logs.trim(), 'input piped to stdout')
  })
})
