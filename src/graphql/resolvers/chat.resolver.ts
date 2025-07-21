import { PubSub } from 'graphql-subscriptions';

import { UseGuards } from '@nestjs/common';
import {
  Args,
  Context,
  Mutation,
  Query,
  Resolver,
  Subscription,
} from '@nestjs/graphql';

import { JwtAuthGuard } from '@/auth';
import { ChatService } from '@/services';

import { GetMessagesInputDto, MessageDto, SendMessageInputDto } from '../dtos';
import { GqlContextType } from '../interfaces';

const pubSub = new PubSub();

@Resolver(() => MessageDto)
export class ChatResolver {
  constructor(private readonly chatService: ChatService) {}

  @UseGuards(JwtAuthGuard)
  @Mutation(() => MessageDto)
  async sendMessage(
    @Args('input') input: SendMessageInputDto,
    @Context() context: GqlContextType,
  ): Promise<MessageDto> {
    const userId = context.req.user.userId;
    const message = await this.chatService.sendMessage({
      userId,
      content: input.content,
    });

    // Publish to GraphQL subscription
    await pubSub.publish('messageAdded', { messageAdded: message });

    return message;
  }

  @UseGuards(JwtAuthGuard)
  @Query(() => [MessageDto])
  async getMessages(
    @Args('input', { nullable: true }) input?: GetMessagesInputDto,
  ): Promise<MessageDto[]> {
    return await this.chatService.getMessages(input?.userId, input?.limit);
  }

  @Subscription(() => MessageDto)
  messageAdded() {
    return pubSub.asyncIterableIterator('messageAdded');
  }
}
