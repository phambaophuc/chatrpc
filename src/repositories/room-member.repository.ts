import { Injectable } from '@nestjs/common';

import { RoomMember, RoomMemberRole } from '@/shared/entities';
import { IRoomMemberRepository } from '@/shared/interfaces';
import { PrismaService } from '@/shared/services';

@Injectable()
export class RoomMemberRepository implements IRoomMemberRepository {
  constructor(private readonly prisma: PrismaService) {}

  async addMember(
    userId: string,
    roomId: string,
    role?: RoomMemberRole,
  ): Promise<RoomMember> {
    const member = await this.prisma.roomMember.create({
      data: {
        userId,
        roomId,
        role,
      },
    });

    return this.mapToEntity(member);
  }

  async removeMember(userId: string, roomId: string): Promise<void> {
    await this.prisma.roomMember.delete({
      where: {
        userId_roomId: {
          userId,
          roomId,
        },
      },
    });
  }

  async findByRoomId(roomId: string): Promise<RoomMember[]> {
    const members = await this.prisma.roomMember.findMany({
      where: { roomId },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            avatar: true,
            isOnline: true,
            lastSeen: true,
          },
        },
      },
    });

    return members.map((member) => this.mapToEntity(member));
  }

  async findByUserId(userId: string): Promise<RoomMember[]> {
    const members = await this.prisma.roomMember.findMany({
      where: { userId },
    });

    return members.map((member) => this.mapToEntity(member));
  }

  async findMember(userId: string, roomId: string): Promise<RoomMember | null> {
    const member = await this.prisma.roomMember.findUnique({
      where: {
        userId_roomId: {
          userId,
          roomId,
        },
      },
    });

    if (!member) return null;
    return this.mapToEntity(member);
  }

  async updateRole(
    userId: string,
    roomId: string,
    role: RoomMemberRole,
  ): Promise<RoomMember> {
    const member = await this.prisma.roomMember.update({
      where: {
        userId_roomId: {
          userId,
          roomId,
        },
      },
      data: { role },
    });

    return this.mapToEntity(member);
  }

  async updateLastRead(userId: string, roomId: string): Promise<void> {
    await this.prisma.roomMember.update({
      where: {
        userId_roomId: {
          userId,
          roomId,
        },
      },
      data: {
        lastRead: new Date(),
      },
    });
  }

  private mapToEntity(member: any): RoomMember {
    return new RoomMember(
      member.id,
      member.userId,
      member.roomId,
      member.role as RoomMemberRole,
      member.joinedAt,
      member.lastRead,
    );
  }
}
