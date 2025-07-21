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

    return new User(
      user.id,
      user.username,
      user.password,
      user.createdAt,
      user.updatedAt,
    );
  }

  async findById(id: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) return null;

    return new User(
      user.id,
      user.username,
      user.password,
      user.createdAt,
      user.updatedAt,
    );
  }

  async create(username: string, hashedPassword: string): Promise<User> {
    const user = await this.prisma.user.create({
      data: {
        username,
        password: hashedPassword,
      },
    });

    return new User(
      user.id,
      user.username,
      user.password,
      user.createdAt,
      user.updatedAt,
    );
  }

  async existsByUsername(username: string): Promise<boolean> {
    const count = await this.prisma.user.count({
      where: { username },
    });
    return count > 0;
  }
}
