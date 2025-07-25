import { Injectable } from '@nestjs/common';

import { Room, RoomType } from '@/shared/entities';
import { IRoomRepository } from '@/shared/interfaces';
import { PrismaService } from '@/shared/services';

@Injectable()
export class RoomRepository implements IRoomRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    name: string,
    description: string | null,
    type: RoomType,
    creatorId: string,
  ): Promise<Room> {
    const room = await this.prisma.room.create({
      data: {
        name,
        description,
        type,
        creatorId,
      },
    });

    return this.mapToEntity(room);
  }

  async findById(id: string): Promise<Room | null> {
    const room = await this.prisma.room.findUnique({
      where: { id },
    });

    if (!room) return null;
    return this.mapToEntity(room);
  }

  async findByUserId(userId: string): Promise<Room[]> {
    const rooms = await this.prisma.room.findMany({
      where: {
        members: {
          some: {
            userId,
          },
        },
        isActive: true,
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });

    return rooms.map((room) => this.mapToEntity(room));
  }

  async findPublicRooms(limit?: number): Promise<Room[]> {
    const rooms = await this.prisma.room.findMany({
      where: {
        type: RoomType.PUBLIC,
        isActive: true,
      },
      take: limit,
      orderBy: {
        createdAt: 'desc',
      },
    });

    return rooms.map((room) => this.mapToEntity(room));
  }

  async update(id: string, data: Partial<Room>): Promise<Room> {
    const room = await this.prisma.room.update({
      where: { id },
      data: {
        ...(data.name && { name: data.name }),
        ...(data.description !== undefined && {
          description: data.description,
        }),
        ...(data.avatar !== undefined && { avatar: data.avatar }),
        ...(data.isActive !== undefined && { isActive: data.isActive }),
      },
    });

    return this.mapToEntity(room);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.room.update({
      where: { id },
      data: { isActive: false },
    });
  }

  async getMemberCount(roomId: string): Promise<number> {
    return await this.prisma.roomMember.count({
      where: { roomId },
    });
  }

  private mapToEntity(room: any): Room {
    return new Room(
      room.id,
      room.name,
      room.description,
      room.type as RoomType,
      room.avatar,
      room.creatorId,
      room.isActive,
      room.createdAt,
      room.updatedAt,
    );
  }
}
