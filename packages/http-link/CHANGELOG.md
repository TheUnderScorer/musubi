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
