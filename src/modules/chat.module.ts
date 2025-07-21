import { Module } from '@nestjs/common';

import { ChatGrpcController } from '@/controllers';
import { ChatResolver } from '@/graphql/resolvers';
import { MessageRepository, UserRepository } from '@/repositories';
import { ChatService } from '@/services';
import { PrismaService } from '@/shared/services';

@Module({
  providers: [
    ChatService,
    ChatResolver,
    MessageRepository,
    UserRepository,
    PrismaService,
    {
      provide: 'IMessageRepository',
      useClass: MessageRepository,
    },
    {
      provide: 'IUserRepository',
      useClass: UserRepository,
    },
  ],
  controllers: [ChatGrpcController],
  exports: [ChatService],
})
export class ChatModule {}
