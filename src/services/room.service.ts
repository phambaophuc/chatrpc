import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { RoomMemberRole, RoomType } from '@/shared/entities';
import {
  ICreateRoomRequest,
  IJoinRoomRequest,
  IRoomMemberRepository,
  IRoomRepository,
  IRoomResponse,
} from '@/shared/interfaces';

@Injectable()
export class RoomService {
  constructor(
    @Inject('IRoomRepository')
    private readonly roomRepository: IRoomRepository,
    @Inject('IRoomMemberRepository')
    private readonly roomMemberRepository: IRoomMemberRepository,
  ) {}

  async createRoom(
    creatorId: string,
    request: ICreateRoomRequest,
  ): Promise<IRoomResponse> {
    const room = await this.roomRepository.create(
      request.name,
      request.description || null,
      request.type,
      creatorId,
    );

    // Add creator as owner
    await this.roomMemberRepository.addMember(
      creatorId,
      room.id,
      RoomMemberRole.OWNER,
    );

    const memberCount = await this.roomRepository.getMemberCount(room.id);

    return {
      ...room.toPlainObject(),
      memberCount,
    };
  }

  async joinRoom(request: IJoinRoomRequest): Promise<void> {
    const room = await this.roomRepository.findById(request.roomId);
    if (!room) {
      throw new NotFoundException('Room not found');
    }

    if (!room.isActive) {
      throw new BadRequestException('Room is not active');
    }

    // Check if user is already a member
    const existingMember = await this.roomMemberRepository.findMember(
      request.userId,
      request.roomId,
    );
    if (existingMember) {
      throw new BadRequestException('User is already a member of this room');
    }

    // For private rooms, user needs invitation (not implemented in this example)
    if (room.type === RoomType.PRIVATE) {
      throw new ForbiddenException('This room requires an invitation');
    }

    await this.roomMemberRepository.addMember(request.userId, request.roomId);
  }

  async leaveRoom(userId: string, roomId: string): Promise<void> {
    const member = await this.roomMemberRepository.findMember(userId, roomId);
    if (!member) {
      throw new NotFoundException('User is not a member of this room');
    }

    // Owner cannot leave room, must transfer ownership first
    if (member.role === RoomMemberRole.OWNER) {
      throw new BadRequestException(
        'Room owner cannot leave. Transfer ownership first.',
      );
    }

    await this.roomMemberRepository.removeMember(userId, roomId);
  }

  async getUserRooms(userId: string): Promise<IRoomResponse[]> {
    const rooms = await this.roomRepository.findByUserId(userId);

    const roomResponses = await Promise.all(
      rooms.map(async (room) => {
        const memberCount = await this.roomRepository.getMemberCount(room.id);
        return {
          ...room.toPlainObject(),
          memberCount,
        };
      }),
    );

    return roomResponses;
  }

  async getPublicRooms(limit?: number): Promise<IRoomResponse[]> {
    const rooms = await this.roomRepository.findPublicRooms(limit);

    const roomResponses = await Promise.all(
      rooms.map(async (room) => {
        const memberCount = await this.roomRepository.getMemberCount(room.id);
        return {
          ...room.toPlainObject(),
          memberCount,
        };
      }),
    );

    return roomResponses;
  }

  async getRoomMembers(roomId: string, userId: string) {
    // Check if user is a member of the room
    const member = await this.roomMemberRepository.findMember(userId, roomId);
    if (!member) {
      throw new ForbiddenException('You are not a member of this room');
    }

    return await this.roomMemberRepository.findByRoomId(roomId);
  }

  async updateMemberRole(
    adminId: string,
    roomId: string,
    targetUserId: string,
    newRole: RoomMemberRole,
  ): Promise<void> {
    const adminMember = await this.roomMemberRepository.findMember(
      adminId,
      roomId,
    );
    if (!adminMember) {
      throw new ForbiddenException('You are not a member of this room');
    }

    // Only owners and admins can change roles
    if (!adminMember.hasPermission(RoomMemberRole.ADMIN)) {
      throw new ForbiddenException('Insufficient permissions');
    }

    const targetMember = await this.roomMemberRepository.findMember(
      targetUserId,
      roomId,
    );
    if (!targetMember) {
      throw new NotFoundException('Target user is not a member of this room');
    }

    // Owners can't be demoted by anyone except themselves
    if (
      targetMember.role === RoomMemberRole.OWNER &&
      adminId !== targetUserId
    ) {
      throw new ForbiddenException('Cannot change owner role');
    }

    // Admins can't promote to owner
    if (
      newRole === RoomMemberRole.OWNER &&
      adminMember.role !== RoomMemberRole.OWNER
    ) {
      throw new ForbiddenException('Only owners can promote to owner');
    }

    await this.roomMemberRepository.updateRole(targetUserId, roomId, newRole);
  }
}
