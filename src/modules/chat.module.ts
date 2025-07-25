import { Module } from '@nestjs/common';

import { ChatResolver } from '@/graphql/resolvers';
import {
  MessageRepository,
  RoomMemberRepository,
  UserRepository,
} from '@/repositories';
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
      provide: 'IRoomMemberRepository',
      useClass: RoomMemberRepository,
    },
  ],
  exports: [ChatService],
})
export class ChatModule {}
