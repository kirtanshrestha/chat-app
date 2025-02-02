<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
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
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

# Chat-App - Real-Time Chat Application with NestJS and WebSockets

**Chat-App** is a real-time chat application built using **NestJS**, **WebSockets**, and **JWT authentication**. This application provides features such as user registration, authentication, real-time messaging, and dynamic chat room management.

## Features

- **JWT-based Authentication**: Secure login and user authentication with JWT tokens.
- **Real-Time Messaging**: Uses WebSockets and Socket.IO for real-time communication between users.
- **Dynamic Chat Rooms**: Users can join and interact in dynamic chat rooms.
- **User Management**: Create, update, and manage users with custom validation and DTOs.
- **Message History**: Messages are saved and broadcasted across rooms in real-time.
- **Swagger API Documentation**: Auto-generated Swagger documentation for easy API interaction.
- **Payment Integration**: Users have wallet/ balance which can be transfered with Stripe and khalti integration.

## Technologies

- **NestJS**: A framework for building efficient and scalable server-side applications.
- **Socket.IO & WebSockets**: Real-time communication for instant messaging.
- **JWT**: Authentication via JSON Web Tokens for secure API access and WebSocket connections.
- **PostgreSQL**: Used for storing user data (and potentially chat history).
- **Swagger**: For easy-to-use, interactive API documentation.

## Project setup

```bash
$ npm install
```

1. add necesary modules
   ```bash
   $ nest g module users
   $ nest g module messages
   $ nest g module auth
   $ nest g module rooms
   $ nest g module chat
   ```

2. install typeorm 
   ```bash
   $ npm install @nestjs/typeorm typeorm
   ```
   add imports and update username password for typeorm in app module

3. install jwt
    ```bash
    npm install @nestjs/passport passport passport-jwt @nestjs/jwt bcrypt
    $ npm install @nestjs/jwt bcrypt
    $ npm install --save-dev @types/bcrypt
    ```

4. setup environment variables and import in module
    ConfigModule.forRoot({ isGlobal: true }), // Load .env globally
    ```bash
    $ npm install @nestjs/config
    ```

5. Generate entities
    ```bash
    $ nest generate class users/entities/user.entity --no-spec
    $ nest generate class messages/entities/message.entity --no-spec
    $ nest generate class chat/entities/chat-room.entity --no-spec
    $ nest generate class rooms/entities/room.entity --no-spec
    ```

6. Install websocket support
  ```bash
  $ npm install @nestjs/websockets @nestjs/platform-socket.io
  ```

7. Add websocket gateway
  ```bash
  nest generate gateway chat
  ```
8. Payment integration
  update keys in env file
  Generate required paymentmodule files
  [forStripe]
  ```bash
  npm install stripe
  ```
  [forKhalti]
  ```bash
  npm install axios
  ```

9. 2FA 
  ```bash
  npm install nodemailer
  ```
  nest g module/service email
  export and import to auth
  sign jwt with email to generate token

10. OTP
    ```bash
    npm install otp-generator
    ```
    
11. Swagger documentation
    ```bash
    npm install @nestjs/swagger swagger-ui-express
    ```

12. Migration during production --USE RELATIVE PATHHHH (../../user/)
    ```bash
    npm install typeorm ts-node tsconfig-paths
    ```
    - set synchronization false
    - setup data-source.ts inside src with correct path for entites and migrations
    - generate migration: npx typeorm-ts-node-commonjs migration:generate ./src/migrations/foreignKeyJoin -d ./src/data-source.ts 
    - run migration: npx typeorm-ts-node-commonjs migration:run -d ./src/data-source.ts 



## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ npm install -g mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
