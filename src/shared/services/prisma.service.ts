import { PrismaClient } from '@prisma/client';

import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor() {
    super({
      log: ['query', 'info', 'warn', 'error'],
    });
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }

  async onModuleInit() {
    await this.$connect();
  }

  async cleanDatabase() {
    if (process.env.NODE_ENV === 'test') {
      const tablenames = await this.$queryRaw<{ tablename: string }[]>`
        SELECT tablename FROM pg_tables WHERE schemaname='public'
      `;

      const tables = tablenames
        .map(({ tablename }) => tablename)
        .filter((name) => name !== '_prisma_migrations')
        .map((name) => `"public"."${name}"`)
        .join(', ');

      try {
        await this.$executeRawUnsafe(`TRUNCATE TABLE ${tables} CASCADE;`);
      } catch (error) {
        if (error instanceof Error) {
          console.error('Error:', error.message);
        } else {
          console.error('Unknown error:', error);
        }
      }
    }
  }
}
