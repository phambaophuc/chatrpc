export enum RoomType {
  PUBLIC = 'PUBLIC',
  PRIVATE = 'PRIVATE',
  DIRECT = 'DIRECT',
}

export class Room {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly description: string | null,
    public readonly type: RoomType,
    public readonly avatar: string | null,
    public readonly creatorId: string,
    public readonly isActive: boolean = true,
    public readonly createdAt?: Date,
    public readonly updatedAt?: Date,
  ) {}

  public toPlainObject() {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      type: this.type,
      avatar: this.avatar,
      creatorId: this.creatorId,
      isActive: this.isActive,
      createdAt: this.createdAt?.toISOString(),
      updatedAt: this.updatedAt?.toISOString(),
    };
  }
}
