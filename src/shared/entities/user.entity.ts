import { compare, hash } from 'bcrypt';

export class User {
  constructor(
    public readonly id: string,
    public readonly username: string,
    private readonly password: string,
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
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
