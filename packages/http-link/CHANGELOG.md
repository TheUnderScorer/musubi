# [0.8.0](https://github.com/TheUnderScorer/musubi/compare/http-link-v0.7.0...http-link-v0.8.0) (2024-04-12)


### Features

* add cloneWithLinks utility ([6545051](https://github.com/TheUnderScorer/musubi/commit/6545051e500b049413dab542ee90ca0339734cc1))
* pass link index ([3e2ce0a](https://github.com/TheUnderScorer/musubi/commit/3e2ce0ab80a95ac84d9492f707aedeceb7b8ee37))
* when unsubscribing from receiver subscription, complete underlying observable ([d03e116](https://github.com/TheUnderScorer/musubi/commit/d03e116125c6bde2d86570af4099550a48754ba3))

# [0.7.0](https://github.com/TheUnderScorer/musubi/compare/http-link-v0.6.5...http-link-v0.7.0) (2024-04-12)


### Features

* remove rxjs ([93f750d](https://github.com/TheUnderScorer/musubi/commit/93f750d6ceb897efcd06ec67c1f65e943297ba37))
* update @tanstack/react-query ([91f2faa](https://github.com/TheUnderScorer/musubi/commit/91f2faa46ca98e4409d8ff9e7a20fd4759d7c9ae))
* update deps ([a24af83](https://github.com/TheUnderScorer/musubi/commit/a24af83d8d184116195849a70c80026c1956dd9e))

## [0.6.5](https://github.com/TheUnderScorer/musubi/compare/http-link-v0.6.4...http-link-v0.6.5) (2023-08-12)


### Bug Fixes

* **core:** remove internal rxjs imports ([4dd614b](https://github.com/TheUnderScorer/musubi/commit/4dd614bc9d686f3844bd251f20178cb9894e1671))
* include "main" field in package.json for better compatibility ([27a5db3](https://github.com/TheUnderScorer/musubi/commit/27a5db3e03d56e309c0a75dd31f4a21261993769))

## [0.6.4](https://github.com/TheUnderScorer/musubi/compare/http-link-v0.6.3...http-link-v0.6.4) (2023-07-11)


### Bug Fixes

* support circular references in request and response payloads ([29329a8](https://github.com/TheUnderScorer/musubi/commit/29329a8981b33479897de8628d0132c4dc40b320))

## [0.6.3](https://github.com/TheUnderScorer/musubi/compare/http-link-v0.6.2...http-link-v0.6.3) (2023-07-09)


### Performance Improvements

* **core:** optimize Merge type ([6588ca7](https://github.com/TheUnderScorer/musubi/commit/6588ca77b72a39f50ef1e7cf6e3b365ba7340982))

## [0.6.2](https://github.com/TheUnderScorer/musubi/compare/http-link-v0.6.1...http-link-v0.6.2) (2023-07-04)


### Bug Fixes

* **core:** add missing Merge type export ([9d07b9c](https://github.com/TheUnderScorer/musubi/commit/9d07b9c32a22262cf380814f1e8b54eda7eb58d2))

## [0.6.1](https://github.com/TheUnderScorer/musubi/compare/http-link-v0.6.0...http-link-v0.6.1) (2023-07-03)


### Performance Improvements

* optimize MergeSchemas type ([f99bc8a](https://github.com/TheUnderScorer/musubi/commit/f99bc8a309f8130a8a9d281d17cda76d1b43a021))

# [0.6.0](https://github.com/TheUnderScorer/musubi/compare/http-link-v0.5.4...http-link-v0.6.0) (2023-05-07)


### Features

* **core:** export id generator ([2ffd65f](https://github.com/TheUnderScorer/musubi/commit/2ffd65f190e1b987d14c38ef67cae318aca9d58c))
* **http-link:** support rest and http format for aws lambda ([f5f6ccc](https://github.com/TheUnderScorer/musubi/commit/f5f6ccc7586c35f1bd0fea4c4f47ac9a0b980cba))

## [0.5.4](https://github.com/TheUnderScorer/musubi/compare/http-link-v0.5.3...http-link-v0.5.4) (2023-05-05)


### Bug Fixes

* **core:** ensure correct typings when using operation receiver builder ([7753b93](https://github.com/TheUnderScorer/musubi/commit/7753b93c40b36a4589a2922dc8bad0dac2c28a11))
* **core:** set default payload to any ([c831a2c](https://github.com/TheUnderScorer/musubi/commit/c831a2c6e85aeb8afef2015dbbbd871008d48c64))
* **core:** use z.infer in ExtractZod type ([6f6c715](https://github.com/TheUnderScorer/musubi/commit/6f6c715f5fed461f40025310faaa014e178993aa))

## [0.5.3](https://github.com/TheUnderScorer/musubi/compare/http-link-v0.5.2...http-link-v0.5.3) (2023-05-05)


### Bug Fixes

* **http-link:** add missing exports ([39d0437](https://github.com/TheUnderScorer/musubi/commit/39d0437517fef9ed32628e680b03a0fc12f5058a))

## [0.5.2](https://github.com/TheUnderScorer/musubi/compare/http-link-v0.5.1...http-link-v0.5.2) (2023-05-05)


### Bug Fixes

* **core:** export middleware types ([3d6cd25](https://github.com/TheUnderScorer/musubi/commit/3d6cd250cf4ccf389dcda8164cae8fcfb52b6410))

## [0.5.1](https://github.com/TheUnderScorer/musubi/compare/http-link-v0.5.0...http-link-v0.5.1) (2023-05-05)


### Bug Fixes

* **core:** add missing "wait" export ([2895ebb](https://github.com/TheUnderScorer/musubi/commit/2895ebb381d49dfc02277f4ee5ecd100aabe660a))

# [0.5.0](https://github.com/TheUnderScorer/musubi/compare/http-link-v0.4.0...http-link-v0.5.0) (2023-05-05)


### Features

* **http-link:** add WIP aws lambda adapter ([5e08e24](https://github.com/TheUnderScorer/musubi/commit/5e08e242f7a04f1ba7ac2adcec9120789f0c0968))

# [0.4.0](https://github.com/TheUnderScorer/musubi/compare/http-link-v0.3.0...http-link-v0.4.0) (2023-04-30)


### Features

* **core:** support modifying context by handlers ([8141576](https://github.com/TheUnderScorer/musubi/commit/8141576997da59d6cd519f901a921c133607931e))
* **http-link:** use correct status code from context ([ea263c3](https://github.com/TheUnderScorer/musubi/commit/ea263c3ed1ff742a0c4fe80e297b2dbf3eaf825e))

# [0.3.0](https://github.com/TheUnderScorer/musubi/compare/http-link-v0.2.1...http-link-v0.3.0) (2023-04-23)


### Bug Fixes

* **core:** set correct operation kind type ([852c004](https://github.com/TheUnderScorer/musubi/commit/852c0049bd5e70fedaa8ff8ae0650d276c5c9f28))


### Features

* **core:** add MusubiZodError ([845fa40](https://github.com/TheUnderScorer/musubi/commit/845fa4007454fae3b1f45f2eb43bd126a1b06574))

## [0.2.1](https://github.com/TheUnderScorer/musubi/compare/http-link-v0.2.0...http-link-v0.2.1) (2023-04-18)


### Bug Fixes

* fix invalid exports path ([fd7b53b](https://github.com/TheUnderScorer/musubi/commit/fd7b53be9c5e9f02d295f8584001a3b637ea733e))

# [0.2.0](https://github.com/TheUnderScorer/musubi/compare/http-link-v0.1.0...http-link-v0.2.0) (2023-04-17)


### Bug Fixes

* fix invalid exports field for single export packages ([9c9079b](https://github.com/TheUnderScorer/musubi/commit/9c9079b6a31b840307e67ba1ea21a9142b778470))


### Features

* **core:** export operation helper ([fc3a053](https://github.com/TheUnderScorer/musubi/commit/fc3a0531bcf212c1f675c23e309777dc6fb14f16))

# [0.1.0](https://github.com/TheUnderScorer/musubi/compare/http-link-v0.0.1...http-link-v0.1.0) (2023-04-16)


### Features

* introduce http link with express adapter ([37bf31a](https://github.com/TheUnderScorer/musubi/commit/37bf31ac14229944233ec18f55e3df3deb41596e))
* introduce LinkPair type ([1f8cf1d](https://github.com/TheUnderScorer/musubi/commit/1f8cf1d65c533f17eee7de905a23629f3731f0ec))


### Performance Improvements

* **http-link:** send part of musubi request in headers for get requests ([b2d24ed](https://github.com/TheUnderScorer/musubi/commit/b2d24ed9def465ad63148ba951ba62213681e5fe))
