import {
  Message,
  MessageType,
  Room,
  RoomMember,
  RoomMemberRole,
  RoomType,
  User,
} from '../entities';

export interface IUserRepository {
  findByUsername(username: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  findById(id: string): Promise<User | null>;
  create(
    username: string,
    email: string | null,
    hashedPassword: string,
  ): Promise<User>;
  existsByUsername(username: string): Promise<boolean>;
  existsByEmail(email: string): Promise<boolean>;
  updateUserStatus(userId: string, isOnline: boolean): Promise<void>;
  findOnlineUsers(): Promise<User[]>;
}

export interface IRoomRepository {
  create(
    name: string,
    description: string | null,
    type: RoomType,
    creatorId: string,
  ): Promise<Room>;
  findById(id: string): Promise<Room | null>;
  findByUserId(userId: string): Promise<Room[]>;
  findPublicRooms(limit?: number): Promise<Room[]>;
  update(id: string, data: Partial<Room>): Promise<Room>;
  delete(id: string): Promise<void>;
  getMemberCount(roomId: string): Promise<number>;
}

export interface IRoomMemberRepository {
  addMember(
    userId: string,
    roomId: string,
    role?: RoomMemberRole,
  ): Promise<RoomMember>;
  removeMember(userId: string, roomId: string): Promise<void>;
  findByRoomId(roomId: string): Promise<RoomMember[]>;
  findByUserId(userId: string): Promise<RoomMember[]>;
  findMember(userId: string, roomId: string): Promise<RoomMember | null>;
  updateRole(
    userId: string,
    roomId: string,
    role: RoomMemberRole,
  ): Promise<RoomMember>;
  updateLastRead(userId: string, roomId: string): Promise<void>;
}

export interface IMessageRepository {
  create(
    content: string,
    type: MessageType,
    userId: string,
    roomId: string,
    replyTo?: string,
  ): Promise<Message>;
  findByRoomId(
    roomId: string,
    limit?: number,
    offset?: number,
  ): Promise<Message[]>;
  findById(id: string): Promise<Message | null>;
  update(id: string, content: string): Promise<Message>;
  delete(id: string): Promise<void>;
  getUnreadCount(userId: string, roomId: string): Promise<number>;
}
