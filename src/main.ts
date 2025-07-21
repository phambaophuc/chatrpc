import { join } from 'path';

import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

import { AppModule } from './app.module';
import { HttpExceptionFilter } from './shared/filters';
import { LoggingInterceptor } from './shared/interceptors';

async function bootstrap() {
  const logger = new Logger('Bootstrap');

  try {
    const app = await NestFactory.create(AppModule);
    const configService = app.get(ConfigService);

    // Global configuration
    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
        transformOptions: {
          enableImplicitConversion: true,
        },
      }),
    );

    app.useGlobalFilters(new HttpExceptionFilter());
    app.useGlobalInterceptors(new LoggingInterceptor());

    // Enable CORS for GraphQL playground and client apps
    app.enableCors({
      origin: ['http://localhost:3000', 'http://localhost:3001'],
      credentials: true,
    });

    // Setup gRPC microservice
    const grpcPort = configService.get<number>('app.grpcPort');
    const grpcOptions: MicroserviceOptions = {
      transport: Transport.GRPC,
      options: {
        package: ['auth', 'chat'],
        protoPath: [
          join(__dirname, '../proto/auth.proto'),
          join(__dirname, '../proto/chat.proto'),
        ],
        url: `0.0.0.0:${grpcPort}`,
        maxSendMessageLength: 1024 * 1024 * 4, // 4MB
        maxReceiveMessageLength: 1024 * 1024 * 4, // 4MB
      },
    };

    // Create and start gRPC microservice
    const grpcApp = await NestFactory.createMicroservice(
      AppModule,
      grpcOptions,
    );
    await grpcApp.listen();
    logger.log(`🚀 gRPC server running on localhost:${grpcPort}`);

    // Start HTTP server for GraphQL
    const port = configService.get<number>('app.port');
    await app.listen(port || 3000);

    logger.log(`🚀 HTTP server running on http://localhost:${port}`);
    logger.log(
      `🚀 GraphQL Playground available at http://localhost:${port}/graphql`,
    );

    // Graceful shutdown
    process.on('SIGTERM', () => {
      logger.log('SIGTERM received, shutting down gracefully');
      Promise.all([app.close(), grpcApp.close()])
        .then(() => {
          process.exit(0);
        })
        .catch((error) => {
          logger.error('Error during shutdown:', error);
          process.exit(1);
        });
    });
  } catch (error) {
    logger.error('Failed to start application', error);
    process.exit(1);
  }
}

bootstrap().catch((error) => {
  console.error('Bootstrap failed:', error);
  process.exit(1);
});
