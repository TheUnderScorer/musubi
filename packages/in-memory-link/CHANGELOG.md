## [0.7.1](https://github.com/TheUnderScorer/musubi/compare/in-memory-link-v0.7.0...in-memory-link-v0.7.1) (2023-04-15)


### Bug Fixes

* **OperationReceiverBuilder:** ensure that error thrown from middleware is propagated ([9ec9ff7](https://github.com/TheUnderScorer/musubi/commit/9ec9ff7b29a49d36ed8590c2ec7de46cddbf8cdc))

# [0.7.0](https://github.com/TheUnderScorer/musubi/compare/in-memory-link-v0.6.0...in-memory-link-v0.7.0) (2023-04-15)


### Bug Fixes

* remove test export ([4f39a29](https://github.com/TheUnderScorer/musubi/commit/4f39a29bfde1b771317d8cfd2484bb9b0259d8e7))
* when defining schema, add name to all operation definitions ([08df112](https://github.com/TheUnderScorer/musubi/commit/08df112caffe6a2d4c13e65416c81178d4c1acb7))


### Features

* add react integration ([3d34065](https://github.com/TheUnderScorer/musubi/commit/3d34065c360633bbc5915779d4f2da26caadcfa0))
* introduce operation receiver builder ([9402832](https://github.com/TheUnderScorer/musubi/commit/9402832f88505f119397a5f310764e92162069b0))
* pass operation to receiver builder ([4126d87](https://github.com/TheUnderScorer/musubi/commit/4126d87e11be4064ef01731431e9024355fdf0a3))
* rename client and receiver ([3f44e4d](https://github.com/TheUnderScorer/musubi/commit/3f44e4dd124ae69a79525b8bd68f04f164358c31))

# [0.6.0](https://github.com/TheUnderScorer/musubi/compare/in-memory-link-v0.5.0...in-memory-link-v0.6.0) (2023-04-12)


### Features

* support passing links as factory functions ([d61debf](https://github.com/TheUnderScorer/musubi/commit/d61debf5631943506b681c23379e62ce13469c26))

# [0.5.0](https://github.com/TheUnderScorer/musubi/compare/in-memory-link-v0.4.1...in-memory-link-v0.5.0) (2023-04-11)


### Features

* support passing metadata to schema and extending it ([b80c085](https://github.com/TheUnderScorer/musubi/commit/b80c085ab33c69bddba5676bb600eebe0c2e0247))

## [0.4.1](https://github.com/TheUnderScorer/musubi/compare/in-memory-link-v0.4.0...in-memory-link-v0.4.1) (2023-04-11)


### Bug Fixes

* allow omitting payload if it is set to undefined in schema ([e0bbae3](https://github.com/TheUnderScorer/musubi/commit/e0bbae3a142d31faccc40c710af5b7e7d807c718))

# [0.4.0](https://github.com/TheUnderScorer/musubi/compare/in-memory-link-v0.3.1...in-memory-link-v0.4.0) (2023-04-11)


### Features

* add esm build ([5fad98d](https://github.com/TheUnderScorer/musubi/commit/5fad98d1d21e19c3c4da5415257f2d40160b3fb8))
* support passing context as non-serializable ([1261218](https://github.com/TheUnderScorer/musubi/commit/126121807c394a67f1adedb4f60e12c37051ee8d))

## [0.3.1](https://github.com/TheUnderScorer/musubi/compare/in-memory-link-v0.3.0...in-memory-link-v0.3.1) (2023-04-09)

# [0.3.0](https://github.com/TheUnderScorer/musubi/compare/in-memory-link-v0.2.0...in-memory-link-v0.3.0) (2023-04-08)


### Features

* add electron link ([547efbf](https://github.com/TheUnderScorer/musubi/commit/547efbfe283e9a4e108cb550b574ce16eb93bff2))
* disable sideEffects ([f05527f](https://github.com/TheUnderScorer/musubi/commit/f05527fbc0fa7dfb57d64d274bc38c47eb563133))

# [0.2.0](https://github.com/TheUnderScorer/musubi/compare/in-memory-link-v0.1.0...in-memory-link-v0.2.0) (2023-03-26)


### Bug Fixes

* update subscribeToEvent return type ([68cf6ab](https://github.com/TheUnderScorer/musubi/commit/68cf6ab21e7ad236bb120706e3f789bc8a432ad6))


### Features

* add browser extension link with example ([0828888](https://github.com/TheUnderScorer/musubi/commit/08288885018593a6d2b06aa46fd04601549e5361))
* pass context to handlers ([b7cbd70](https://github.com/TheUnderScorer/musubi/commit/b7cbd70b481f17eb9fb5d7f25bd298b60df008f4))
* validate payload and result using zod ([9a3183e](https://github.com/TheUnderScorer/musubi/commit/9a3183e226f920d391ae9f85d806bd3725a233e6))

# [0.1.0](https://github.com/TheUnderScorer/musubi/compare/in-memory-link-v0.0.4...in-memory-link-v0.1.0) (2023-03-23)


### Bug Fixes

* fix broken receiver if one link doesn't receive requests ([530c583](https://github.com/TheUnderScorer/musubi/commit/530c5837b59eee5da9ad0812f0eab39d8b87decd))
* fix output path ([70edfcb](https://github.com/TheUnderScorer/musubi/commit/70edfcbe5ee5dcc2925749e77115ff44270046be))


### Features

* support passing channel ([80e02b5](https://github.com/TheUnderScorer/musubi/commit/80e02b50f39815c164b4f62c9f9a23b382168908))

## [0.0.4](https://github.com/TheUnderScorer/musubi/compare/in-memory-link-v0.0.3...in-memory-link-v0.0.4) (2023-03-22)


### Bug Fixes

* add publishConfig ([1670baf](https://github.com/TheUnderScorer/musubi/commit/1670baf7dc72861fe97885ff4197c64551055161))

## [0.0.3](https://github.com/TheUnderScorer/musubi/compare/in-memory-link-v0.0.2...in-memory-link-v0.0.3) (2023-03-22)


### Bug Fixes

* make package public ([6bd7767](https://github.com/TheUnderScorer/musubi/commit/6bd77676abd090ccde9e4257897e6c89d7d98508))

## [0.0.2](https://github.com/TheUnderScorer/musubi/compare/in-memory-link-v0.0.1...in-memory-link-v0.0.2) (2023-03-22)


### Bug Fixes

* fix broken memory link ([5d393e7](https://github.com/TheUnderScorer/musubi/commit/5d393e7d8432c1448a771babdcd7e9040b24b967))
