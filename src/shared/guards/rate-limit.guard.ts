import { Observable } from 'rxjs';

import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';

@Injectable()
export class RateLimitGuard implements CanActivate {
  private requests = new Map<string, { count: number; resetTime: number }>();
  private readonly maxRequests = 100; // requests per window
  private readonly windowMs = 15 * 60 * 1000; // 15 minutes

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const clientId = this.getClientId(request);

    const now = Date.now();
    const clientData = this.requests.get(clientId);

    if (!clientData || now > clientData.resetTime) {
      this.requests.set(clientId, {
        count: 1,
        resetTime: now + this.windowMs,
      });
      return true;
    }

    if (clientData.count >= this.maxRequests) {
      throw new HttpException(
        'Too Many Requests',
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    clientData.count++;
    return true;
  }

  private getClientId(request: any): string {
    return request.ip || request.connection.remoteAddress || 'unknown';
  }
}
