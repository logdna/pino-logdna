# pino-logdna
<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->
[![All Contributors](https://img.shields.io/badge/all_contributors-2-orange.svg?style=flat-square)](#contributors-)
<!-- ALL-CONTRIBUTORS-BADGE:END -->

> Transport pino logs to LogDNA

- [pino-logdna](#pino-logdna)
  - [Install](#install)
  - [Usage](#usage)
    - [Pino v7+ Transport](#pino-v7-transport)
      - [Options](#options)
    - [Legacy Transport](#legacy-transport)
      - [CLI Options](#cli-options)
  - [Contributors ✨](#contributors-)
  - [License](#license)

## Install

```bash
npm install --save pino-logdna
```

## Usage

### Pino v7+ Transport

This module can be used as a [pino transport][]:

```javascript
const pino = require('pino')
const transport = pino.transport({
  target: 'pino-logdna',
  options: {
    key // your LogDNA ingestion key
  }
})

const log = pino(transport)

// Logs will now go to LogDNA
log.info('Happy Logging!')
```

#### Options

This transport uses [`@logdna/logger`][] under the hood, and most options are exposed
through `pino-logdna`. 

For a full list, please see the [`createLogger` options][]

### Legacy Transport

Usage as a legacy transport is still supported. The minimal configuration requires only 
your LogDNA ingestion key:

```bash
npm install -g pino-logdna
node ./app.js | pino-logdna --key="YOUR INGESTION KEY"
```

[CLI Options](#cli-options) can be supplied to the command:

```bash
node ./app.js | pino-logdna --key "YOUR INGESTION KEY" --env staging --tag foo --tag bar
```

#### CLI Options

Options for the CLI are the kebab-case equivalent of the [`@logdna/logger`][] options:

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

## Contributors ✨

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="https://www.linkedin.com/in/ziehlke/"><img src="https://avatars.githubusercontent.com/u/226042?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Maciej Ziehlke</b></sub></a><br /><a href="#original-digitalmio" title="Original author/maintainer">⭐</a></td>
    <td align="center"><a href="https://github.com/mdeltito"><img src="https://avatars.githubusercontent.com/u/69520?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Mike Del Tito</b></sub></a><br /><a href="https://github.com/logdna/pino-logdna/commits?author=mdeltito" title="Code">💻</a> <a href="https://github.com/logdna/pino-logdna/commits?author=mdeltito" title="Documentation">📖</a> <a href="#example-mdeltito" title="Examples">💡</a> <a href="#tool-mdeltito" title="Tools">🔧</a></td>
  </tr>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!

## License

Copyright © [LogDNA](https://logdna.com), released under an MIT license. See the [LICENSE](./LICENSE) file and https://opensource.org/licenses/MIT

*Happy Logging!*

[pino transport]: https://getpino.io/#/docs/transports?id=v7-transports
[legacy transport]: https://getpino.io/#/docs/transports?id=legacy-transports
[`@logdna/logger`]: https://github.com/logdna/logger-node#api
[`createLogger` options]: https://github.com/logdna/logger-node#createloggerkey-options
