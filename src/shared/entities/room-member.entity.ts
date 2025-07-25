export enum RoomMemberRole {
  OWNER = 'OWNER',
  ADMIN = 'ADMIN',
  MODERATOR = 'MODERATOR',
  MEMBER = 'MEMBER',
}

export class RoomMember {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly roomId: string,
    public readonly role: RoomMemberRole,
    public readonly joinedAt: Date,
    public readonly lastRead: Date | null = null,
  ) {}

  public hasPermission(requiredRole: RoomMemberRole): boolean {
    const roleHierarchy = {
      [RoomMemberRole.MEMBER]: 0,
      [RoomMemberRole.MODERATOR]: 1,
      [RoomMemberRole.ADMIN]: 2,
      [RoomMemberRole.OWNER]: 3,
    };

    return roleHierarchy[this.role] >= roleHierarchy[requiredRole];
  }
}
