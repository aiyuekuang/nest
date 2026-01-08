import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { LoggerService } from '../logger/logger.service';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(private readonly logger: LoggerService) {}

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();

    let errorCode = exception?.code || -1;
    let errorMsg = exception?.msg || exception?.message || '服务器内部错误';

    if (exception instanceof HttpException) {
      errorCode = exception.getStatus();
      errorMsg = exception.message;
    }

    // 记录错误日志
    this.logger.error(
      `[${request.method}] ${request.url}`,
      `错误码: ${errorCode}`,
      `错误信息: ${errorMsg}`,
      exception.stack || '',
    );

    response.status(200).json({
      code: errorCode,
      msg: errorMsg,
    });
  }
}
