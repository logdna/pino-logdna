## Changelog

## [3.0.4](https://github.com/logdna/pino-logdna/compare/v3.0.3...v3.0.4) (2024-02-02)


### Chores

* bump logdna/logger-node@2.6.8 [422c26f](https://github.com/logdna/pino-logdna/commit/422c26fd4df9c4fc0646c76e45bf9eab722940a3) - Mike Del Tito, closes: [#14](https://github.com/logdna/pino-logdna/issues/14)

## [3.0.3](https://github.com/logdna/pino-logdna/compare/v3.0.2...v3.0.3) (2022-06-29)


### Continuous Integration

* add commitlint tooling and config [56f4c8b](https://github.com/logdna/pino-logdna/commit/56f4c8be067194222fa47d0ebee659f2f41a72f4) - Mike Del Tito, closes: [#7](https://github.com/logdna/pino-logdna/issues/7)


### Documentation

* **wiki**: add @jsumners as a contributor [c224933](https://github.com/logdna/pino-logdna/commit/c224933492b09fcaa83f599fe27694587717768f) - Mike Del Tito

## [3.0.2](https://github.com/logdna/pino-logdna/compare/v3.0.1...v3.0.2) (2022-05-06)


### Bug Fixes

* data logs being dropped [3353e5e](https://github.com/logdna/pino-logdna/commit/3353e5e243f694c5f256fa86e40363a49c93a1a9) - James Sumners

## [3.0.1](https://github.com/logdna/pino-logdna/compare/v3.0.0...v3.0.1) (2022-05-06)


### Bug Fixes

* upgrade pino-abstract-transport from 0.4.0 to 0.5.0 [1be9bb7](https://github.com/logdna/pino-logdna/commit/1be9bb71b4f1fe61eca2c4715a30dcd1667406e5) - Mike Del Tito

# [3.0.0](https://github.com/logdna/pino-logdna/compare/v2.0.0...v3.0.0) (2021-10-27)


### Chores

* **deps**: add pino-abstract-transport@0.4.0 [1de4429](https://github.com/logdna/pino-logdna/commit/1de44290d4b91f40e14c77ba10b17799acf7c3ca) - Mike Del Tito
* **deps**: remove unused depdendencies [7122edd](https://github.com/logdna/pino-logdna/commit/7122edde9429839fb94928938a8f16e0327ab899) - Mike Del Tito
* **deps**: update eslint-config-logdna@5.1.0 [1d95205](https://github.com/logdna/pino-logdna/commit/1d952054b71104f794cf33f92963393255872a79) - Mike Del Tito
* **deps**: update eslint@7.32.0 [6460338](https://github.com/logdna/pino-logdna/commit/64603383c2456511baa053e8252f8d856c2b3405) - Mike Del Tito
* **deps**: update logdna/logger@2.4.1 [2301db4](https://github.com/logdna/pino-logdna/commit/2301db491aefe2fdb48430b2697eaaabfe8927d4) - Mike Del Tito
* **deps**: update pino@7.0.5 [53ff8c5](https://github.com/logdna/pino-logdna/commit/53ff8c5639c84c4c29bc4487237c174d6a186196) - Mike Del Tito
* **deps**: update tap@15.0.10 [458b6a3](https://github.com/logdna/pino-logdna/commit/458b6a3eca575360076c570e9689fbc5873c2b29) - Mike Del Tito


### Features

* implement pino@7 transport interface [8933c41](https://github.com/logdna/pino-logdna/commit/8933c41c97ba2ec941453e1ebe79b43deaecfb2a) - Mike Del Tito, closes: [#3](https://github.com/logdna/pino-logdna/issues/3)


### **BREAKING CHANGES**

* This transport is now untested *as an in-process log
destination* for `pino < 7.0.0`, and while it may work, it is not recommended
and will no longer be officially supported. Users that wish to use the
latest version of `pino-logdna` with earlier versions of `pino` should
pipe program output to the transport instead. See
https://getpino.io/#/docs/transports?id=legacy-transports

# [2.0.0](https://github.com/logdna/pino-logdna/compare/v1.0.0...v2.0.0) (2021-02-19)


### Chores

* **deps**: update semantic-release deps [850605a](https://github.com/logdna/pino-logdna/commit/850605a677597b5e00c0ce60344acda7fc46d20f) - Mike Del Tito


### Miscellaneous

* add @digitalmio as a contributor [c89e262](https://github.com/logdna/pino-logdna/commit/c89e26222e5bf177f7999507285ba030369a4e7c) - Mike Del Tito
* add @mdeltito as a contributor [27202d8](https://github.com/logdna/pino-logdna/commit/27202d84473340f6d23d891e1c494be772d82172) - Mike Del Tito


### **BREAKING CHANGES**

* Adding @mdeltito as a contributor for release of 2.0.0 of
this package.

# 1.0.0 (2021-02-10)


### Continuous Integration

* use semantic-release for publishing [57f0496](https://github.com/logdna/pino-logdna/commit/57f0496b0edd7d1bf18b6ae04b45b00a8078a83b) - Mike Del Tito


### Features

* initial implementation [c4b61c8](https://github.com/logdna/pino-logdna/commit/c4b61c855c916521872acab2576c6fe61bec02df) - Mike Del Tito


### Miscellaneous

* Initial commit [84280d5](https://github.com/logdna/pino-logdna/commit/84280d574587f688376af2a5d41c768242abd7b6) - Mike Del Tito
