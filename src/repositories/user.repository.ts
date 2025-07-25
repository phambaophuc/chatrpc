import { Injectable } from '@nestjs/common';

import { User } from '@/shared/entities';
import { IUserRepository } from '@/shared/interfaces';
import { PrismaService } from '@/shared/services';

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByUsername(username: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { username },
    });

    if (!user) return null;
    return this.mapToEntity(user);
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) return null;
    return this.mapToEntity(user);
  }

  async findById(id: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) return null;
    return this.mapToEntity(user);
  }

  async create(
    username: string,
    email: string | null,
    hashedPassword: string,
  ): Promise<User> {
    const user = await this.prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
      },
    });

    return this.mapToEntity(user);
  }

  async existsByUsername(username: string): Promise<boolean> {
    const count = await this.prisma.user.count({
      where: { username },
    });
    return count > 0;
  }

  async existsByEmail(email: string): Promise<boolean> {
    const count = await this.prisma.user.count({
      where: { email },
    });
    return count > 0;
  }

  async updateUserStatus(userId: string, isOnline: boolean): Promise<void> {
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        isOnline,
        lastSeen: new Date(),
      },
    });
  }

  async findOnlineUsers(): Promise<User[]> {
    const users = await this.prisma.user.findMany({
      where: { isOnline: true },
    });

    return users.map((user) => this.mapToEntity(user));
  }

  private mapToEntity(user: any): User {
    return new User(
      user.id,
      user.username,
      user.email,
      user.password,
      user.avatar,
      user.isOnline,
      user.lastSeen,
      user.createdAt,
      user.updatedAt,
    );
  }
}
