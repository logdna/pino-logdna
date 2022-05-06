#!/usr/bin/env node
'use strict'

const fs = require('fs')
const path = require('path')
const url = require('url')
const nopt = require('nopt')
const pinoLogdna = require('../index.js')
const {version} = require('../package.json')
const usage = fs.readFileSync(path.join(__dirname, './usage.txt'), 'utf8')

module.exports = main

const noptions = {
  'key': String
, 'tag': Array
, 'timeout': Number
, 'app': String
, 'env': String
, 'hostname': String
, 'mac': String
, 'ip': String
, 'url': url
, 'flush-limit': Number
, 'flush-interval-ms': Number
, 'base-backoff-ms': Number
, 'max-backoff-ms': Number
, 'index-meta': Boolean
, 'proxy': url
, 'message-key': String
, 'empty-message': String
}

const nshort = {
  h: ['--help']
, v: ['--version']
, m: ['--message-key']
, e: ['--empty-message']
, t: ['--tag']
, T: ['--timeout']
, H: ['--hostname']
, p: ['--proxy']
, E: ['--env']
}

const invalid = []
nopt.invalidHandler = (key, val) => {
  invalid.push([key, val])
}

if (module === require.main) {
  const {argv: _, ...input} = nopt(noptions, nshort)
  if (input.help) return console.log(usage.trim())
  if (input.version) return console.log(version.trim())

  main(inputToOptions(input)).catch(errorHandler)
}

async function main(options) {
  if (invalid.length) {
    const err = new Error('Invalid options')
    err.meta = {invalid}
    throw err
  }

  if (!options.key) {
    throw new Error('Missing LogDNA key (-k, --key)')
  }

  const transport = pinoLogdna({
    ...options
  , tags: options.tag
  , onError: console.error
  })

  process.stdin.pipe(process.stdout)
  process.stdin.pipe(transport)
}

function inputToOptions(input) {
  let options = {}
  for (const [key, value] of Object.entries(input)) {
    const option = key.replace(/-./g, (match) => {
      return match[1].toUpperCase()
    })
    options = {...options, [option]: value}
  }

  return options
}

function errorHandler(err) {
  process.nextTick(() => {
    throw err
  })
}
