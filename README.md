

## Description

The purpose of this API is to provide functionality for publishing, interacting with, and viewing articles, as well as for creating users and implementing a following system. The articles are displayed in a feed format, allowing users to easily view and interact with them.

The API includes several endpoints that allow users to perform various actions, such as creating and updating articles, liking and commenting on articles, and following other users. Users can also create accounts and manage their profiles through the API.

Overall, this RESTful API built with Nest.js provides a robust and scalable platform for publishing and interacting with articles, as well as for managing users and implementing a following system.

## Getting Started

### Prerequisites

* **git** should be installed (recommended v2.4.11 or higher)
* **docker** and **docker compose** should be installed

### Instalation

```bash
$ git pull https://github.com/Leticia-NdO/blog_nestjs.git
```

## Running the app

Make sure to open a terminal on the project's directory and then run:

```bash
$ docker-compose up --build
```

And that's it! The API must be running on port 3000.

## Features in development

* I'm currently working to detach the business rules from the NestJS Framework, so that the API can use all the advantages NestJS offers without being perpetually tied to it. I'm doing so by concentrating the business rules in a folder called 'core', outside NestJS domain;
* The Swagger documentation;
* The 'comments' module;
* The creation of the distinction between common users and premium users;
* The creation of a payment system.

## Stay in touch

- Author - [Leticia Neves de Oliveira](https://www.linkedin.com/in/leticia-neves-192940234/)

## License

Nest is [MIT licensed](LICENSE).

<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->
