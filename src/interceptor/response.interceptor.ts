import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable, catchError, map, throwError } from 'rxjs';
import { ApiResponseDto } from '../common/dto/api-response.dto';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(
    _context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    return next.handle().pipe(
      map((data) => {
        // 如果已经是 ApiResponseDto 格式，直接返回
        if (data instanceof ApiResponseDto) {
          return data;
        }

        // 否则包装成标准格式
        return ApiResponseDto.success(data, '成功');
      }),
      catchError((err) => {
        let errorMsg =
          err?.response?.message || err?.message || '服务器内部错误';
        let errorCode = err?.response?.code || err?.code || -1;

        if (Array.isArray(errorMsg)) {
          errorMsg = errorMsg.join(',');
        }

        // 如果是自定义异常，直接返回
        if (err instanceof ApiResponseDto) {
          return throwError(() => err);
        }

        return throwError(() => ApiResponseDto.error(errorMsg, errorCode));
      }),
    );
  }
}
