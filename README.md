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

# Professional Chat System

A scalable real-time chat system built with NestJS, GraphQL, gRPC, PostgreSQL, and Prisma.

## Features

- 🔐 JWT Authentication with bcrypt password hashing
- 💬 Real-time messaging with GraphQL subscriptions
- 🚀 High-performance gRPC API
- 🗄️ PostgreSQL database with Prisma ORM
- 🎯 SOLID principles and clean architecture
- 🔒 Rate limiting and security measures
- 🧪 Comprehensive testing suite
- 📊 Health checks and metrics
- 🐳 Docker containerization

## Tech Stack

- **Backend**: NestJS, TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **APIs**: GraphQL (Apollo Server), gRPC
- **Authentication**: JWT with Passport
- **Real-time**: WebSocket subscriptions, gRPC streaming
- **Testing**: Jest

## Quick Start

### Local Development

1. Install dependencies: `npm install`
2. Setup PostgreSQL database
3. Configure environment: `cp .env.example .env`
4. Generate Prisma client: `npm run db:generate`
5. Run migrations: `npm run db:migrate`
6. Seed database: `npm run db:seed`
7. Start development server: `npm run start:dev`

## API Usage

### GraphQL Examples

```graphql
# Register user
mutation {
  register(input: {
    username: "john_doe"
    password: "password123"
  }) {
    userId
    token
  }
}

# Login
mutation {
  login(input: {
    username: "john_doe"
    password: "password123"
  }) {
    userId
    token
  }
}

# Send message (requires authentication)
mutation {
  sendMessage(input: {
    content: "Hello World!"
  }) {
    id
    userId
    content
    timestamp
  }
}

# Subscribe to messages
subscription {
  messageAdded {
    id
    userId
    content
    timestamp
  }
}
```

### gRPC Examples

```typescript
// Login
const response = await authClient.login({
  username: "john_doe",
  password: "password123"
});

// Send message
const message = await chatClient.sendMessage({
  userId: "user_id",
  content: "Hello from gRPC!"
});

// Stream messages
const stream = chatClient.streamMessages({ userId: "user_id" });
stream.on('data', (message) => {
  console.log('New message:', message);
});
```

## Architecture

The application follows clean architecture principles with clear separation of concerns:

- **Domain Layer**: Entities and business logic
- **Application Layer**: Services and use cases  
- **Infrastructure Layer**: Repositories and external services
- **Presentation Layer**: Controllers and resolvers

## Testing

```bash
# Run tests
npm run test

# Run tests with coverage
npm run test:cov

# Run tests in watch mode
npm run test:watch
```

## Database Management

```bash
# Generate Prisma client
npm run db:generate

# Create and run migration
npm run db:migrate

# Seed database
npm run db:seed

# Reset database
npm run db:reset

# Open Prisma Studio
npm run db:studio
```

## Production Deployment

1. Build the application: `npm run build`
2. Set production environment variables
3. Run database migrations: `npm run db:migrate`
4. Start the application: `npm run start:prod`

## Environment Variables

```bash
DATABASE_URL=postgresql://username:password@localhost:5432/chat_db
JWT_SECRET=your-super-secret-jwt-key
NODE_ENV=development
PORT=3000
GRPC_PORT=5000
```

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
