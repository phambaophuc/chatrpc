import { compare, hash } from 'bcrypt';

export enum UserStatus {
  ONLINE = 'ONLINE',
  OFFLINE = 'OFFLINE',
  AWAY = 'AWAY',
}

export class User {
  constructor(
    public readonly id: string,
    public readonly username: string,
    public readonly email: string | null,
    private readonly password: string,
    public readonly avatar: string | null = null,
    public readonly isOnline: boolean = false,
    public readonly lastSeen: Date = new Date(),
    public readonly createdAt?: Date,
    public readonly updatedAt?: Date,
  ) {}

  public async validatePassword(password: string): Promise<boolean> {
    return await compare(password, this.password);
  }

  public static async hashPassword(password: string): Promise<string> {
    const saltRounds = 12;
    return await hash(password, saltRounds);
  }

  public toSafeObject() {
    return {
      id: this.id,
      username: this.username,
      email: this.email,
      avatar: this.avatar,
      isOnline: this.isOnline,
      lastSeen: this.lastSeen,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
