import { Injectable } from '@nestjs/common';

import { Message } from '@/shared/entities';
import { IMessageRepository } from '@/shared/interfaces';
import { PrismaService } from '@/shared/services';

@Injectable()
export class MessageRepository implements IMessageRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, content: string): Promise<Message> {
    const message = await this.prisma.message.create({
      data: {
        userId,
        content,
      },
    });

    return new Message(
      message.id,
      message.userId,
      message.content,
      message.createdAt,
      message.updatedAt,
    );
  }

  async findByUserId(userId: string, limit?: number): Promise<Message[]> {
    const messages = await this.prisma.message.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });

    return messages.map(
      (msg) =>
        new Message(
          msg.id,
          msg.userId,
          msg.content,
          msg.createdAt,
          msg.updatedAt,
        ),
    );
  }

  async findAll(limit?: number): Promise<Message[]> {
    const messages = await this.prisma.message.findMany({
      orderBy: { createdAt: 'desc' },
      take: limit,
      include: {
        user: {
          select: {
            id: true,
            username: true,
          },
        },
      },
    });

    return messages.map(
      (msg) =>
        new Message(
          msg.id,
          msg.userId,
          msg.content,
          msg.createdAt,
          msg.updatedAt,
        ),
    );
  }

  async findById(id: string): Promise<Message | null> {
    const message = await this.prisma.message.findUnique({
      where: { id },
    });

    if (!message) return null;

    return new Message(
      message.id,
      message.userId,
      message.content,
      message.createdAt,
      message.updatedAt,
    );
  }
}
