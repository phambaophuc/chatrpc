import { Test } from '@nestjs/testing';

import { PrismaService } from '@/shared/services';

export class TestDatabase {
  private prisma: PrismaService;

  async setup() {
    const moduleRef = await Test.createTestingModule({
      providers: [PrismaService],
    }).compile();

    this.prisma = moduleRef.get(PrismaService);
    await this.prisma.cleanDatabase();
  }

  async cleanup() {
    await this.prisma.cleanDatabase();
    await this.prisma.$disconnect();
  }

  getPrisma() {
    return this.prisma;
  }
}
