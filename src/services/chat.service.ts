import { Subject } from 'rxjs';

import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { MessageType } from '@/shared/entities';
import {
  IMessageRepository,
  IMessageResponse,
  IRoomMemberRepository,
  ISendMessageRequest,
} from '@/shared/interfaces';

@Injectable()
export class ChatService {
  private messageSubjects = new Map<string, Subject<IMessageResponse>>();

  constructor(
    @Inject('IMessageRepository')
    private readonly messageRepository: IMessageRepository,
    @Inject('IRoomMemberRepository')
    private readonly roomMemberRepository: IRoomMemberRepository,
  ) {}

  async sendMessage(
    userId: string,
    request: ISendMessageRequest,
  ): Promise<IMessageResponse> {
    // Validate input
    if (!request.content?.trim()) {
      throw new BadRequestException('Message content cannot be empty');
    }

    // Check if user is a member of the room
    const member = await this.roomMemberRepository.findMember(
      userId,
      request.roomId,
    );
    if (!member) {
      throw new ForbiddenException('You are not a member of this room');
    }

    // Validate reply message exists if replyTo is provided
    if (request.replyTo) {
      const parentMessage = await this.messageRepository.findById(
        request.replyTo,
      );
      if (!parentMessage || parentMessage.roomId !== request.roomId) {
        throw new BadRequestException('Invalid reply message');
      }
    }

    // Create message
    const message = await this.messageRepository.create(
      request.content.trim(),
      request.type || MessageType.TEXT,
      userId,
      request.roomId,
      request.replyTo,
    );

    // Get full message with user info
    const fullMessage = await this.messageRepository.findById(message.id);
    if (!fullMessage) {
      throw new Error('Failed to retrieve created message');
    }

    const response: IMessageResponse = this.mapMessageToResponse(fullMessage);

    // Broadcast to all subscribers
    this.broadcastToRoom(request.roomId, response);

    return response;
  }

  async getRoomMessages(
    userId: string,
    roomId: string,
    limit?: number,
    offset?: number,
  ): Promise<IMessageResponse[]> {
    // Check if user is a member of the room
    const member = await this.roomMemberRepository.findMember(userId, roomId);
    if (!member) {
      throw new ForbiddenException('You are not a member of this room');
    }

    const messages = await this.messageRepository.findByRoomId(
      roomId,
      limit,
      offset,
    );
    return messages.map((message) => this.mapMessageToResponse(message));
  }

  async editMessage(
    userId: string,
    messageId: string,
    newContent: string,
  ): Promise<IMessageResponse> {
    const message = await this.messageRepository.findById(messageId);
    if (!message) {
      throw new NotFoundException('Message not found');
    }

    if (message.userId !== userId) {
      throw new ForbiddenException('You can only edit your own messages');
    }

    if (!newContent?.trim()) {
      throw new BadRequestException('Message content cannot be empty');
    }

    const updatedMessage = await this.messageRepository.update(
      messageId,
      newContent.trim(),
    );
    const fullMessage = await this.messageRepository.findById(
      updatedMessage.id,
    );

    if (!fullMessage) {
      throw new Error('Failed to retrieve updated message');
    }

    const response = this.mapMessageToResponse(fullMessage);

    // Broadcast update to room
    this.broadcastToRoom(message.roomId, response);

    return response;
  }

  async deleteMessage(userId: string, messageId: string): Promise<void> {
    const message = await this.messageRepository.findById(messageId);
    if (!message) {
      throw new NotFoundException('Message not found');
    }

    // Check permissions - user can delete own messages or be admin/owner
    const member = await this.roomMemberRepository.findMember(
      userId,
      message.roomId,
    );
    if (!member) {
      throw new ForbiddenException('You are not a member of this room');
    }

    const canDelete =
      message.userId === userId || member.hasPermission(member.role);

    if (!canDelete) {
      throw new ForbiddenException(
        'Insufficient permissions to delete this message',
      );
    }

    await this.messageRepository.delete(messageId);

    // Broadcast deletion to room
    this.broadcastToRoom(message.roomId, {
      id: messageId,
      content: '',
      type: MessageType.SYSTEM,
      userId: '',
      roomId: message.roomId,
      replyTo: null,
      isEdited: false,
      timestamp: new Date().toISOString(),
      user: { id: '', username: 'System', avatar: null },
    });
  }

  async markAsRead(userId: string, roomId: string): Promise<void> {
    const member = await this.roomMemberRepository.findMember(userId, roomId);
    if (!member) {
      throw new ForbiddenException('You are not a member of this room');
    }

    await this.roomMemberRepository.updateLastRead(userId, roomId);
  }

  async getUnreadCount(userId: string, roomId: string): Promise<number> {
    const member = await this.roomMemberRepository.findMember(userId, roomId);
    if (!member) {
      return 0;
    }

    return await this.messageRepository.getUnreadCount(userId, roomId);
  }

  subscribeToRoom(roomId: string): Subject<IMessageResponse> {
    if (!this.messageSubjects.has(roomId)) {
      this.messageSubjects.set(roomId, new Subject<IMessageResponse>());
    }
    return this.messageSubjects.get(roomId)!;
  }

  private broadcastToRoom(roomId: string, message: IMessageResponse): void {
    const subject = this.messageSubjects.get(roomId);
    if (subject) {
      subject.next(message);
    }
  }

  private mapMessageToResponse(message: any): IMessageResponse {
    return {
      id: message.id,
      content: message.content,
      type: message.type,
      userId: message.userId,
      roomId: message.roomId,
      replyTo: message.replyTo,
      isEdited: message.isEdited,
      timestamp: message.createdAt.toISOString(),
      user: {
        id: message.user?.id || message.userId,
        username: message.user?.username || 'Unknown',
        avatar: message.user?.avatar || null,
      },
      ...(message.parent && {
        replyToMessage: {
          id: message.parent.id,
          content: message.parent.content,
          user: {
            username: message.parent.user.username,
          },
        },
      }),
    };
  }
}
