# pino-logdna

> Transport pino logs to LogDNA

* [Install](#install)
* [Usage](#usage)
  - [CLI](#cli)
  - [API](#api)
* [Options](#options)
* [License](#license)

## Install

```bash
npm install -g pino-logdna
```

## Usage

### CLI

The minimal configuration requires only your LogDNA ingestion key:

```bash
node ./app.js | pino-logdna --key="YOUR INGESTION KEY"
```

[Options](#options) can be supplied to the command:

```bash
node ./app.js | pino-logdna --key "YOUR INGESTION KEY" --env staging --tag foo --tag bar
```

### API

Pino generally recommends against [in-process transports][], however it _is_ possible to 
use this transport as a log destination in your application:

```js
const pinoLogdna = require('pino-logdna')
const opts = { /* pino options */ }
const stream = pinoLogdna({key: process.env.LOGDNA_INGESTION_KEY})
const log = pino(opts, stream)

// It is recommended to attach a handler for the logger error event:
stream.on('error', (err) => {
  // Output to stderr
  console.error(err)
})

// You may also pass an `onError` handler as an option:
// pinoLogdna({
//   key: process.env.LOGDNA_INGESTION_KEY
// , onError: console.error
// })

// Logs now go to LogDNA
log.debug('Happy logging!') 
```

## Options

This transport uses [`@logdna/logger`][] under the hood, and most options are exposed
through `pino-logdna`. Note that options for the CLI are the kebab-case equivalent of the
[`@logdna/logger`][] options:

```bash
Options:
  -v, --version                   Show version
  -h, --help                      Show usage information
  -m, --message-key [msg]         The field in the `pino` used as the display line in LogDNA 

@logdna/logger Options:
      --key                       *REQUIRED* Your ingestion key
  -t, --tag                       Tag to be added to each message; can be supplied multiple times
  -T, --timeout [30000]           Millisecond timeout for each HTTP request
      --app [default]             Arbitrary app name for labeling each message
  -E, --env                       An environment label attached to each message
  -H, --hostname                  Hostname for each HTTP request
      --mac                       MAC address for each HTTP request
      --ip                        IPv4 or IPv6 address for each HTTP request
      --url                       URL of the logging server
      --flush-limit [5000000]     Maximum total line lengths before a flush is forced
      --flush-interval-ms [250]   Mseconds to wait before sending the buffer
      --base-backoff-ms [3000]    Minimum exponential backoff time in milliseconds
      --max-backoff-ms [30000]    Maximum exponential backoff time in milliseconds
      --index-meta [false]        Controls whether meta data for each message is searchable
  -p, --proxy                     The full URL of an http or https proxy to pass through
```

## License

Copyright © [LogDNA](https://logdna.com), released under an MIT license. See the [LICENSE](./LICENSE) file and https://opensource.org/licenses/MIT

*Happy Logging!*

[in-process transports]: https://getpino.io/#/docs/transports?id=in-process-transports
[`@logdna/logger`]: https://github.com/logdna/logger-node#api
