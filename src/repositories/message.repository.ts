import { Injectable } from '@nestjs/common';

import { Message, MessageType } from '@/shared/entities';
import { IMessageRepository } from '@/shared/interfaces';
import { PrismaService } from '@/shared/services';

@Injectable()
export class MessageRepository implements IMessageRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    content: string,
    type: MessageType,
    userId: string,
    roomId: string,
    replyTo?: string,
  ): Promise<Message> {
    const message = await this.prisma.message.create({
      data: {
        content,
        type,
        userId,
        roomId,
        replyTo,
      },
    });

    return this.mapToEntity(message);
  }

  async findByRoomId(
    roomId: string,
    limit: number = 50,
    offset: number = 0,
  ): Promise<Message[]> {
    const messages = await this.prisma.message.findMany({
      where: { roomId },
      take: limit,
      skip: offset,
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            avatar: true,
          },
        },
        parent: {
          select: {
            id: true,
            content: true,
            user: {
              select: {
                username: true,
              },
            },
          },
        },
      },
    });

    return messages.map((message) => this.mapToEntity(message)).reverse();
  }

  async findById(id: string): Promise<Message | null> {
    const message = await this.prisma.message.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            avatar: true,
          },
        },
        parent: {
          select: {
            id: true,
            content: true,
            user: {
              select: {
                username: true,
              },
            },
          },
        },
      },
    });

    if (!message) return null;
    return this.mapToEntity(message);
  }

  async update(id: string, content: string): Promise<Message> {
    const message = await this.prisma.message.update({
      where: { id },
      data: {
        content,
        isEdited: true,
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            avatar: true,
          },
        },
      },
    });

    return this.mapToEntity(message);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.message.delete({
      where: { id },
    });
  }

  async getUnreadCount(userId: string, roomId: string): Promise<number> {
    const member = await this.prisma.roomMember.findUnique({
      where: {
        userId_roomId: {
          userId,
          roomId,
        },
      },
    });

    if (!member || !member.lastRead) {
      return await this.prisma.message.count({
        where: { roomId },
      });
    }

    return await this.prisma.message.count({
      where: {
        roomId,
        createdAt: {
          gt: member.lastRead,
        },
      },
    });
  }

  private mapToEntity(message: any): Message {
    return new Message(
      message.id,
      message.content,
      message.type as MessageType,
      message.userId,
      message.roomId,
      message.replyTo,
      message.isEdited,
      message.createdAt,
      message.updatedAt,
    );
  }
}
