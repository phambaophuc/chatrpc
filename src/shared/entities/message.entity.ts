export class Message {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly content: string,
    public readonly createdAt: Date,
    public readonly updatedAt?: Date,
  ) {}

  public toPlainObject() {
    return {
      id: this.id,
      userId: this.userId,
      content: this.content,
      timestamp: this.createdAt.toISOString(),
    };
  }
}
