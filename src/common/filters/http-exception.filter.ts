import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

/**
 * HTTP 异常过滤器
 * 统一处理和格式化异常响应
 */
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  /**
   * 捕获并处理异常
   * @param exception - HTTP 异常
   * @param host - 参数主机
   */
  catch(exception: HttpException, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();

    // 构建错误响应
    const errorResponse = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      message:
        typeof exceptionResponse === 'string'
          ? exceptionResponse
          : (exceptionResponse as any).message || '请求失败',
      error:
        typeof exceptionResponse === 'object'
          ? (exceptionResponse as any).error
          : undefined,
    };

    // 记录错误日志（脱敏处理）
    this.logger.error(
      `HTTP ${status} Error: ${request.method} ${request.url}`,
      JSON.stringify({
        ...errorResponse,
        // 不记录敏感信息
        body: this.sanitizeData(request.body),
        query: this.sanitizeData(request.query),
      }),
    );

    response.status(status).json(errorResponse);
  }

  /**
   * 数据脱敏处理
   * @param data - 原始数据
   * @returns 脱敏后的数据
   */
  private sanitizeData(data: any): any {
    if (!data) return data;

    const sensitiveFields = ['password', 'token', 'secret', 'authorization'];
    const sanitized = { ...data };

    for (const field of sensitiveFields) {
      if (sanitized[field]) {
        sanitized[field] = '***';
      }
    }

    return sanitized;
  }
}
