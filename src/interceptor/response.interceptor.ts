import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable, catchError, map, throwError } from 'rxjs';
import { Response } from 'express';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    const ctx = context.switchToHttp();

    return next.handle().pipe(
      map((data) => ({
        code: 200,
        data: data,
        msg: '成功',
      })),
      catchError((err) => {
        let errorMsg = err?.response?.message || err?.message;
        if (Array.isArray(errorMsg)) {
          errorMsg = errorMsg.join(',');
        }
        return throwError({
          code: -1,
          msg: errorMsg,
        });
      }),
    );
  }
}
