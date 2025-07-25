import { Module } from '@nestjs/common';

import { RoomResolver } from '@/graphql/resolvers';
import { RoomMemberRepository, RoomRepository } from '@/repositories';
import { RoomService } from '@/services';
import { PrismaService } from '@/shared/services';

@Module({
  providers: [
    RoomService,
    RoomResolver,
    RoomRepository,
    RoomMemberRepository,
    PrismaService,
    {
      provide: 'IRoomRepository',
      useClass: RoomRepository,
    },
    {
      provide: 'IRoomMemberRepository',
      useClass: RoomMemberRepository,
    },
  ],
  exports: [RoomService, RoomRepository, RoomMemberRepository],
})
export class RoomModule {}
