export enum MessageType {
  TEXT = 'TEXT',
  IMAGE = 'IMAGE',
  FILE = 'FILE',
  SYSTEM = 'SYSTEM',
}

export class Message {
  constructor(
    public readonly id: string,
    public readonly content: string,
    public readonly type: MessageType,
    public readonly userId: string,
    public readonly roomId: string,
    public readonly replyTo: string | null = null,
    public readonly isEdited: boolean = false,
    public readonly createdAt: Date,
    public readonly updatedAt?: Date,
  ) {}

  public toPlainObject() {
    return {
      id: this.id,
      content: this.content,
      type: this.type,
      userId: this.userId,
      roomId: this.roomId,
      replyTo: this.replyTo,
      isEdited: this.isEdited,
      timestamp: this.createdAt.toISOString(),
      updatedAt: this.updatedAt?.toISOString(),
    };
  }
}
