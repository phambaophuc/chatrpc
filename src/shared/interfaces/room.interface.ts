import { RoomMemberRole, RoomType } from '../entities';

export interface ICreateRoomRequest {
  name: string;
  description?: string;
  type: RoomType;
  avatar?: string;
}

export interface IJoinRoomRequest {
  roomId: string;
  userId: string;
}

export interface IUpdateRoomMemberRoleRequest {
  roomId: string;
  userId: string;
  newRole: RoomMemberRole;
}

export interface IRoomResponse {
  id: string;
  name: string;
  description: string | null;
  type: RoomType;
  avatar: string | null;
  creatorId: string;
  isActive: boolean;
  memberCount: number;
  unreadCount?: number;
  createdAt?: string;
  updatedAt?: string;
}
