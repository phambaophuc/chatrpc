import { Module } from '@nestjs/common';

import { HealthController } from '@/health';
import { MetricsService } from '@/services';
import { PrismaService } from '@/shared/services';

@Module({
  providers: [PrismaService, MetricsService],
  controllers: [HealthController],
})
export class HealthModule {}
