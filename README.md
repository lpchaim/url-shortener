<p align="center">A simple URL shortening service.</p>
<p align="center">
  <a href="https://www.github.com/[text]" target="_blank">
    <img src="https://img.shields.io/github/license/lpchaim/url-shortener" alt="Package License"/>
  </a>
  <a href="https://circleci.com/gh/lpchaim/url-shortener" target="_blank">
    <img src="https://img.shields.io/circleci/build/gh/lpchaim/url-shortener" alt="CircleCI"/>
  </a>
</p>

## Description

A project meant to develop my NestJS skills, as well as practice real world implementations of CI/CD and dockerization.

### Goals
- [ ] Minimally viable simple URL shortening API
  - [x] Create short URLs
  - [x] Redirect shortened URL to the original
  - [ ] Simple statistics about each shortened URL
- [x] CI - Build, Tests
- [ ] CD - Deployment
- [ ] Docker build

## Development environment

### [Nix](https://nixos.org/)
Run the following on the root folder
```bash
$ nix-shell
```
### Others
Manually install the requirements
- NodeJS 18.x

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## License

This project is [GNU General Public License v3.0](LICENSE) licensed.
