import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  PayloadTooLargeException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { LoggerService } from 'src/logger/logger.service';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    let errorCode = exception?.code || -1;
    let errorMsg = exception?.msg || exception?.message;
    if (exception instanceof HttpException) {
      errorCode = exception.getStatus();
      errorMsg = exception.message;
    }

    const response = ctx.getResponse<Response>();
    response.status(200).json({
      code: errorCode,
      msg: errorMsg,
    });
  }
}
