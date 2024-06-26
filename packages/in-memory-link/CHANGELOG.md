## [0.14.1](https://github.com/TheUnderScorer/musubi/compare/in-memory-link-v0.14.0...in-memory-link-v0.14.1) (2024-04-13)


### Bug Fixes

* loosen ctx requirement ([1303ebe](https://github.com/TheUnderScorer/musubi/commit/1303ebe6d7400a609d66c929ddc2159bebcfb3d8))
* remove unnecessary handlers ([e3d1143](https://github.com/TheUnderScorer/musubi/commit/e3d114309045d0af79094ac7143cfa99d46d3970))

# [0.14.0](https://github.com/TheUnderScorer/musubi/compare/in-memory-link-v0.13.0...in-memory-link-v0.14.0) (2024-04-12)


### Features

* add cloneWithLinks utility ([6545051](https://github.com/TheUnderScorer/musubi/commit/6545051e500b049413dab542ee90ca0339734cc1))
* pass link index ([3e2ce0a](https://github.com/TheUnderScorer/musubi/commit/3e2ce0ab80a95ac84d9492f707aedeceb7b8ee37))
* when unsubscribing from receiver subscription, complete underlying observable ([d03e116](https://github.com/TheUnderScorer/musubi/commit/d03e116125c6bde2d86570af4099550a48754ba3))

# [0.13.0](https://github.com/TheUnderScorer/musubi/compare/in-memory-link-v0.12.5...in-memory-link-v0.13.0) (2024-04-12)


### Features

* remove rxjs ([93f750d](https://github.com/TheUnderScorer/musubi/commit/93f750d6ceb897efcd06ec67c1f65e943297ba37))
* update @tanstack/react-query ([91f2faa](https://github.com/TheUnderScorer/musubi/commit/91f2faa46ca98e4409d8ff9e7a20fd4759d7c9ae))
* update deps ([a24af83](https://github.com/TheUnderScorer/musubi/commit/a24af83d8d184116195849a70c80026c1956dd9e))

## [0.12.5](https://github.com/TheUnderScorer/musubi/compare/in-memory-link-v0.12.4...in-memory-link-v0.12.5) (2023-08-12)


### Bug Fixes

* **core:** remove internal rxjs imports ([4dd614b](https://github.com/TheUnderScorer/musubi/commit/4dd614bc9d686f3844bd251f20178cb9894e1671))
* include "main" field in package.json for better compatibility ([27a5db3](https://github.com/TheUnderScorer/musubi/commit/27a5db3e03d56e309c0a75dd31f4a21261993769))

## [0.12.4](https://github.com/TheUnderScorer/musubi/compare/in-memory-link-v0.12.3...in-memory-link-v0.12.4) (2023-07-11)


### Bug Fixes

* support circular references in request and response payloads ([29329a8](https://github.com/TheUnderScorer/musubi/commit/29329a8981b33479897de8628d0132c4dc40b320))

## [0.12.3](https://github.com/TheUnderScorer/musubi/compare/in-memory-link-v0.12.2...in-memory-link-v0.12.3) (2023-07-09)


### Performance Improvements

* **core:** optimize Merge type ([6588ca7](https://github.com/TheUnderScorer/musubi/commit/6588ca77b72a39f50ef1e7cf6e3b365ba7340982))

## [0.12.2](https://github.com/TheUnderScorer/musubi/compare/in-memory-link-v0.12.1...in-memory-link-v0.12.2) (2023-07-04)


### Bug Fixes

* **core:** add missing Merge type export ([9d07b9c](https://github.com/TheUnderScorer/musubi/commit/9d07b9c32a22262cf380814f1e8b54eda7eb58d2))

## [0.12.1](https://github.com/TheUnderScorer/musubi/compare/in-memory-link-v0.12.0...in-memory-link-v0.12.1) (2023-07-03)


### Performance Improvements

* optimize MergeSchemas type ([f99bc8a](https://github.com/TheUnderScorer/musubi/commit/f99bc8a309f8130a8a9d281d17cda76d1b43a021))

# [0.12.0](https://github.com/TheUnderScorer/musubi/compare/in-memory-link-v0.11.3...in-memory-link-v0.12.0) (2023-05-07)


### Features

* **core:** export id generator ([2ffd65f](https://github.com/TheUnderScorer/musubi/commit/2ffd65f190e1b987d14c38ef67cae318aca9d58c))

## [0.11.3](https://github.com/TheUnderScorer/musubi/compare/in-memory-link-v0.11.2...in-memory-link-v0.11.3) (2023-05-05)


### Bug Fixes

* **core:** ensure correct typings when using operation receiver builder ([7753b93](https://github.com/TheUnderScorer/musubi/commit/7753b93c40b36a4589a2922dc8bad0dac2c28a11))
* **core:** set default payload to any ([c831a2c](https://github.com/TheUnderScorer/musubi/commit/c831a2c6e85aeb8afef2015dbbbd871008d48c64))
* **core:** use z.infer in ExtractZod type ([6f6c715](https://github.com/TheUnderScorer/musubi/commit/6f6c715f5fed461f40025310faaa014e178993aa))

## [0.11.2](https://github.com/TheUnderScorer/musubi/compare/in-memory-link-v0.11.1...in-memory-link-v0.11.2) (2023-05-05)


### Bug Fixes

* **core:** export middleware types ([3d6cd25](https://github.com/TheUnderScorer/musubi/commit/3d6cd250cf4ccf389dcda8164cae8fcfb52b6410))

## [0.11.1](https://github.com/TheUnderScorer/musubi/compare/in-memory-link-v0.11.0...in-memory-link-v0.11.1) (2023-05-05)


### Bug Fixes

* **core:** add missing "wait" export ([2895ebb](https://github.com/TheUnderScorer/musubi/commit/2895ebb381d49dfc02277f4ee5ecd100aabe660a))

# [0.11.0](https://github.com/TheUnderScorer/musubi/compare/in-memory-link-v0.10.0...in-memory-link-v0.11.0) (2023-04-30)


### Features

* **core:** support modifying context by handlers ([8141576](https://github.com/TheUnderScorer/musubi/commit/8141576997da59d6cd519f901a921c133607931e))

# [0.10.0](https://github.com/TheUnderScorer/musubi/compare/in-memory-link-v0.9.1...in-memory-link-v0.10.0) (2023-04-23)


### Bug Fixes

* **core:** set correct operation kind type ([852c004](https://github.com/TheUnderScorer/musubi/commit/852c0049bd5e70fedaa8ff8ae0650d276c5c9f28))


### Features

* **core:** add MusubiZodError ([845fa40](https://github.com/TheUnderScorer/musubi/commit/845fa4007454fae3b1f45f2eb43bd126a1b06574))

## [0.9.1](https://github.com/TheUnderScorer/musubi/compare/in-memory-link-v0.9.0...in-memory-link-v0.9.1) (2023-04-18)


### Bug Fixes

* fix invalid exports path ([fd7b53b](https://github.com/TheUnderScorer/musubi/commit/fd7b53be9c5e9f02d295f8584001a3b637ea733e))

# [0.9.0](https://github.com/TheUnderScorer/musubi/compare/in-memory-link-v0.8.0...in-memory-link-v0.9.0) (2023-04-17)


### Bug Fixes

* fix invalid exports field for single export packages ([9c9079b](https://github.com/TheUnderScorer/musubi/commit/9c9079b6a31b840307e67ba1ea21a9142b778470))


### Features

* **core:** export operation helper ([fc3a053](https://github.com/TheUnderScorer/musubi/commit/fc3a0531bcf212c1f675c23e309777dc6fb14f16))

# [0.8.0](https://github.com/TheUnderScorer/musubi/compare/in-memory-link-v0.7.1...in-memory-link-v0.8.0) (2023-04-16)


### Features

* introduce http link with express adapter ([37bf31a](https://github.com/TheUnderScorer/musubi/commit/37bf31ac14229944233ec18f55e3df3deb41596e))
* introduce LinkPair type ([1f8cf1d](https://github.com/TheUnderScorer/musubi/commit/1f8cf1d65c533f17eee7de905a23629f3731f0ec))

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
