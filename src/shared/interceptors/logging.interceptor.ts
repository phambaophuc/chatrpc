import { Observable, tap } from 'rxjs';

import {
  CallHandler,
  ContextType,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);

  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<any> | Promise<Observable<any>> {
    const now = Date.now();
    const type = context.getType<ContextType | 'graphql'>();

    let method = 'UNKNOWN';
    let path = 'UNKNOWN';

    if (type === 'http') {
      const request = context.switchToHttp().getRequest();
      method = request.method;
      path = request.url;
    } else if (type === 'rpc') {
      method = context.getHandler().name;
      path = context.getClass().name;
    } else if (type === 'graphql') {
      const info = context.getArgByIndex(3);
      method = info?.parentType?.name;
      path = info?.fieldName;
    }

    return next.handle().pipe(
      tap(() => {
        const time = Date.now() - now;
        this.logger.log(`${method} ${path} - ${time}ms`);
      }),
    );
  }
}
