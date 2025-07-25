import { UseGuards } from '@nestjs/common';
import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';

import { JwtAuthGuard } from '@/auth';
import { RoomService } from '@/services';
import { CurrentUser } from '@/shared/decorators';

import { CreateRoomInputDto, JoinRoomInputDto, RoomDto } from '../dtos';

@Resolver(() => RoomDto)
@UseGuards(JwtAuthGuard)
export class RoomResolver {
  constructor(private readonly roomService: RoomService) {}

  @Mutation(() => RoomDto)
  async createRoom(
    @Args('input') input: CreateRoomInputDto,
    @CurrentUser() user: any,
  ): Promise<RoomDto> {
    return await this.roomService.createRoom(user.userId, input);
  }

  @Mutation(() => Boolean)
  async joinRoom(
    @Args('input') input: JoinRoomInputDto,
    @CurrentUser() user: any,
  ): Promise<boolean> {
    await this.roomService.joinRoom({
      roomId: input.roomId,
      userId: user.userId,
    });
    return true;
  }

  @Mutation(() => Boolean)
  async leaveRoom(
    @Args('roomId') roomId: string,
    @CurrentUser() user: any,
  ): Promise<boolean> {
    await this.roomService.leaveRoom(user.userId, roomId);
    return true;
  }

  @Query(() => [RoomDto])
  async myRooms(@CurrentUser() user: any): Promise<RoomDto[]> {
    return await this.roomService.getUserRooms(user.userId);
  }

  @Query(() => [RoomDto])
  async publicRooms(
    @Args('limit', { type: () => Int, nullable: true }) limit?: number,
  ): Promise<RoomDto[]> {
    return await this.roomService.getPublicRooms(limit);
  }

  // @Query(() => [RoomMemberDto])
  // async roomMembers(
  //   @Args('roomId') roomId: string,
  //   @CurrentUser() user: any,
  // ): Promise<RoomMemberDto[]> {
  //   return await this.roomService.getRoomMembers(roomId, user.userId);
  // }
}
