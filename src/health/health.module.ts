import { Module } from '@nestjs/common';

import { MetricsService } from '@/services';
import { PrismaService } from '@/shared/services';

import { HealthController } from './health.controller';

@Module({
  providers: [PrismaService, MetricsService],
  controllers: [HealthController],
})
export class HealthModule {}
