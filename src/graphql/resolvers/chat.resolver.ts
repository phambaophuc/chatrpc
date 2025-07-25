import { PubSub } from 'graphql-subscriptions';

import { UseGuards } from '@nestjs/common';
import {
  Args,
  Int,
  Mutation,
  Query,
  Resolver,
  Subscription,
} from '@nestjs/graphql';

import { JwtAuthGuard } from '@/auth';
import { ChatService } from '@/services';
import { CurrentUser } from '@/shared/decorators';

import { GetMessagesInputDto, MessageDto, SendMessageInputDto } from '../dtos';

const pubSub = new PubSub();

@Resolver(() => MessageDto)
export class ChatResolver {
  constructor(private readonly chatService: ChatService) {}

  @Mutation(() => MessageDto)
  @UseGuards(JwtAuthGuard)
  async sendMessage(
    @Args('input') input: SendMessageInputDto,
    @CurrentUser() user: any,
  ): Promise<MessageDto> {
    const message = await this.chatService.sendMessage(user.userId, input);

    // Publish to GraphQL subscription
    await pubSub.publish(`room_${input.roomId}`, { roomMessages: message });

    return message;
  }

  @Query(() => [MessageDto])
  @UseGuards(JwtAuthGuard)
  async getRoomMessages(
    @Args('input') input: GetMessagesInputDto,
    @CurrentUser() user: any,
  ): Promise<MessageDto[]> {
    return await this.chatService.getRoomMessages(
      user.userId,
      input.roomId,
      input.limit,
      input.offset,
    );
  }

  @Mutation(() => MessageDto)
  @UseGuards(JwtAuthGuard)
  async editMessage(
    @Args('messageId') messageId: string,
    @Args('content') content: string,
    @CurrentUser() user: any,
  ): Promise<MessageDto> {
    const message = await this.chatService.editMessage(
      user.userId,
      messageId,
      content,
    );

    // Publish update to subscription
    await pubSub.publish(`room_${message.roomId}`, { roomMessages: message });

    return message;
  }

  @Mutation(() => Boolean)
  @UseGuards(JwtAuthGuard)
  async deleteMessage(
    @Args('messageId') messageId: string,
    @CurrentUser() user: any,
  ): Promise<boolean> {
    await this.chatService.deleteMessage(user.userId, messageId);
    return true;
  }

  @Mutation(() => Boolean)
  @UseGuards(JwtAuthGuard)
  async markAsRead(
    @Args('roomId') roomId: string,
    @CurrentUser() user: any,
  ): Promise<boolean> {
    await this.chatService.markAsRead(user.userId, roomId);
    return true;
  }

  @Query(() => Int)
  @UseGuards(JwtAuthGuard)
  async getUnreadCount(
    @Args('roomId') roomId: string,
    @CurrentUser() user: any,
  ): Promise<number> {
    return await this.chatService.getUnreadCount(user.userId, roomId);
  }

  @Subscription(() => MessageDto, {
    filter: (payload, variables) => {
      // Only send messages to users who are members of the room
      return payload.roomMessages.roomId === variables.roomId;
    },
  })
  roomMessages(@Args('roomId') roomId: string) {
    return pubSub.asyncIterableIterator(`room_${roomId}`);
  }
}
