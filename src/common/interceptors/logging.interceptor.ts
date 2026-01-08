import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

/**
 * 日志拦截器
 * 记录请求和响应信息
 */
@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);

  /**
   * 拦截请求
   * @param context - 执行上下文
   * @param next - 调用处理器
   * @returns Observable
   */
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url, ip } = request;
    const userAgent = request.get('user-agent') || '';
    const now = Date.now();

    this.logger.log(
      `请求开始: ${method} ${url} - IP: ${ip} - UserAgent: ${userAgent}`,
    );

    return next.handle().pipe(
      tap({
        next: (_data: any): void => {
          const response = context.switchToHttp().getResponse();
          const { statusCode } = response;
          const delay = Date.now() - now;

          this.logger.log(
            `请求完成: ${method} ${url} - 状态码: ${statusCode} - 耗时: ${delay}ms`,
          );
        },
        error: (error: Error): void => {
          const delay = Date.now() - now;
          this.logger.error(
            `请求失败: ${method} ${url} - 错误: ${error.message} - 耗时: ${delay}ms`,
          );
        },
      }),
    );
  }
}
