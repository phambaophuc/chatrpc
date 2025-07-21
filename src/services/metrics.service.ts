import { Injectable } from '@nestjs/common';

@Injectable()
export class MetricsService {
  private requestCount = 0;
  private errorCount = 0;
  private responseTimeSum = 0;
  private responseTimeCount = 0;

  incrementRequestCount() {
    this.requestCount++;
  }

  incrementErrorCount() {
    this.errorCount++;
  }

  recordResponseTime(time: number) {
    this.responseTimeSum += time;
    this.responseTimeCount++;
  }

  getMetrics() {
    return {
      requestCount: this.requestCount,
      errorCount: this.errorCount,
      averageResponseTime:
        this.responseTimeCount > 0
          ? this.responseTimeSum / this.responseTimeCount
          : 0,
      errorRate:
        this.requestCount > 0 ? (this.errorCount / this.requestCount) * 100 : 0,
    };
  }

  reset() {
    this.requestCount = 0;
    this.errorCount = 0;
    this.responseTimeSum = 0;
    this.responseTimeCount = 0;
  }
}
