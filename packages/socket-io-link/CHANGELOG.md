# [0.6.0](https://github.com/TheUnderScorer/musubi/compare/socket-io-link-v0.5.0...socket-io-link-v0.6.0) (2024-04-12)


### Features

* add cloneWithLinks utility ([6545051](https://github.com/TheUnderScorer/musubi/commit/6545051e500b049413dab542ee90ca0339734cc1))
* pass link index ([3e2ce0a](https://github.com/TheUnderScorer/musubi/commit/3e2ce0ab80a95ac84d9492f707aedeceb7b8ee37))
* when unsubscribing from receiver subscription, complete underlying observable ([d03e116](https://github.com/TheUnderScorer/musubi/commit/d03e116125c6bde2d86570af4099550a48754ba3))

# [0.5.0](https://github.com/TheUnderScorer/musubi/compare/socket-io-link-v0.4.7...socket-io-link-v0.5.0) (2024-04-12)


### Features

* remove rxjs ([93f750d](https://github.com/TheUnderScorer/musubi/commit/93f750d6ceb897efcd06ec67c1f65e943297ba37))
* update @tanstack/react-query ([91f2faa](https://github.com/TheUnderScorer/musubi/commit/91f2faa46ca98e4409d8ff9e7a20fd4759d7c9ae))
* update deps ([a24af83](https://github.com/TheUnderScorer/musubi/commit/a24af83d8d184116195849a70c80026c1956dd9e))

## [0.4.7](https://github.com/TheUnderScorer/musubi/compare/socket-io-link-v0.4.6...socket-io-link-v0.4.7) (2023-08-15)


### Bug Fixes

* add channel exports ([3cff6ac](https://github.com/TheUnderScorer/musubi/commit/3cff6acde6839c3aa2d781f4b19498b88c7c3b7d))

## [0.4.6](https://github.com/TheUnderScorer/musubi/compare/socket-io-link-v0.4.5...socket-io-link-v0.4.6) (2023-08-12)


### Bug Fixes

* **core:** remove internal rxjs imports ([4dd614b](https://github.com/TheUnderScorer/musubi/commit/4dd614bc9d686f3844bd251f20178cb9894e1671))
* include "main" field in package.json for better compatibility ([27a5db3](https://github.com/TheUnderScorer/musubi/commit/27a5db3e03d56e309c0a75dd31f4a21261993769))

## [0.4.5](https://github.com/TheUnderScorer/musubi/compare/socket-io-link-v0.4.4...socket-io-link-v0.4.5) (2023-07-11)


### Bug Fixes

* support circular references in request and response payloads ([29329a8](https://github.com/TheUnderScorer/musubi/commit/29329a8981b33479897de8628d0132c4dc40b320))

## [0.4.4](https://github.com/TheUnderScorer/musubi/compare/socket-io-link-v0.4.3...socket-io-link-v0.4.4) (2023-07-09)


### Performance Improvements

* **core:** optimize Merge type ([6588ca7](https://github.com/TheUnderScorer/musubi/commit/6588ca77b72a39f50ef1e7cf6e3b365ba7340982))

## [0.4.3](https://github.com/TheUnderScorer/musubi/compare/socket-io-link-v0.4.2...socket-io-link-v0.4.3) (2023-07-04)


### Bug Fixes

* **core:** add missing Merge type export ([9d07b9c](https://github.com/TheUnderScorer/musubi/commit/9d07b9c32a22262cf380814f1e8b54eda7eb58d2))

## [0.4.2](https://github.com/TheUnderScorer/musubi/compare/socket-io-link-v0.4.1...socket-io-link-v0.4.2) (2023-07-03)


### Performance Improvements

* optimize MergeSchemas type ([f99bc8a](https://github.com/TheUnderScorer/musubi/commit/f99bc8a309f8130a8a9d281d17cda76d1b43a021))

## [0.4.1](https://github.com/TheUnderScorer/musubi/compare/socket-io-link-v0.4.0...socket-io-link-v0.4.1) (2023-06-15)

# [0.4.0](https://github.com/TheUnderScorer/musubi/compare/socket-io-link-v0.3.3...socket-io-link-v0.4.0) (2023-05-07)


### Features

* **core:** export id generator ([2ffd65f](https://github.com/TheUnderScorer/musubi/commit/2ffd65f190e1b987d14c38ef67cae318aca9d58c))

## [0.3.3](https://github.com/TheUnderScorer/musubi/compare/socket-io-link-v0.3.2...socket-io-link-v0.3.3) (2023-05-05)


### Bug Fixes

* **core:** ensure correct typings when using operation receiver builder ([7753b93](https://github.com/TheUnderScorer/musubi/commit/7753b93c40b36a4589a2922dc8bad0dac2c28a11))
* **core:** set default payload to any ([c831a2c](https://github.com/TheUnderScorer/musubi/commit/c831a2c6e85aeb8afef2015dbbbd871008d48c64))
* **core:** use z.infer in ExtractZod type ([6f6c715](https://github.com/TheUnderScorer/musubi/commit/6f6c715f5fed461f40025310faaa014e178993aa))

## [0.3.2](https://github.com/TheUnderScorer/musubi/compare/socket-io-link-v0.3.1...socket-io-link-v0.3.2) (2023-05-05)


### Bug Fixes

* **core:** export middleware types ([3d6cd25](https://github.com/TheUnderScorer/musubi/commit/3d6cd250cf4ccf389dcda8164cae8fcfb52b6410))

## [0.3.1](https://github.com/TheUnderScorer/musubi/compare/socket-io-link-v0.3.0...socket-io-link-v0.3.1) (2023-05-05)


### Bug Fixes

* **core:** add missing "wait" export ([2895ebb](https://github.com/TheUnderScorer/musubi/commit/2895ebb381d49dfc02277f4ee5ecd100aabe660a))

# [0.3.0](https://github.com/TheUnderScorer/musubi/compare/socket-io-link-v0.2.0...socket-io-link-v0.3.0) (2023-04-30)


### Features

* **core:** support modifying context by handlers ([8141576](https://github.com/TheUnderScorer/musubi/commit/8141576997da59d6cd519f901a921c133607931e))

# [0.2.0](https://github.com/TheUnderScorer/musubi/compare/socket-io-link-v0.1.1...socket-io-link-v0.2.0) (2023-04-23)


### Bug Fixes

* **core:** set correct operation kind type ([852c004](https://github.com/TheUnderScorer/musubi/commit/852c0049bd5e70fedaa8ff8ae0650d276c5c9f28))


### Features

* **core:** add MusubiZodError ([845fa40](https://github.com/TheUnderScorer/musubi/commit/845fa4007454fae3b1f45f2eb43bd126a1b06574))

## [0.1.1](https://github.com/TheUnderScorer/musubi/compare/socket-io-link-v0.1.0...socket-io-link-v0.1.1) (2023-04-18)


### Bug Fixes

* fix invalid exports path ([fd7b53b](https://github.com/TheUnderScorer/musubi/commit/fd7b53be9c5e9f02d295f8584001a3b637ea733e))

# [0.1.0](https://github.com/TheUnderScorer/musubi/compare/socket-io-link-v0.0.1...socket-io-link-v0.1.0) (2023-04-18)


### Bug Fixes

* fix invalid exports field for single export packages ([9c9079b](https://github.com/TheUnderScorer/musubi/commit/9c9079b6a31b840307e67ba1ea21a9142b778470))


### Features

* **core:** export operation helper ([fc3a053](https://github.com/TheUnderScorer/musubi/commit/fc3a0531bcf212c1f675c23e309777dc6fb14f16))
* **socket-io-link:** add socket link ([f48c4ce](https://github.com/TheUnderScorer/musubi/commit/f48c4cec0fe21ff488c7928c5f52da003a870351))
* **socket-io-link:** support defining default channel in schema meta ([e2b38e7](https://github.com/TheUnderScorer/musubi/commit/e2b38e743ff89efb67865baf4440a630d5a9f834))
