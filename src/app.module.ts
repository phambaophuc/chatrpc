import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';

import { appConfig } from './config';
import { HealthModule } from './health';
import { AuthModule, ChatModule, RoomModule } from './modules';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [appConfig],
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: 'schema.gql',
      sortSchema: true,
      subscriptions: {
        'graphql-ws': true,
        'subscriptions-transport-ws': true,
      },
      context: ({ req, connection }) => {
        if (connection) {
          return { req: connection.context };
        }
        return { req };
      },
    }),
    AuthModule,
    ChatModule,
    RoomModule,
    HealthModule,
  ],
})
export class AppModule {}
