import { HttpException, HttpStatus } from '@nestjs/common';

export class CustomException extends HttpException {
  constructor(message: string, statusCode: number = HttpStatus.BAD_REQUEST) {
    super(
      {
        code: statusCode,
        message,
        timestamp: new Date().toISOString(),
      },
      statusCode
    );
  }
}

export class UnauthorizedException extends CustomException {
  constructor(message: string = '未授权访问') {
    super(message, HttpStatus.UNAUTHORIZED);
  }
}

export class ForbiddenException extends CustomException {
  constructor(message: string = '权限不足') {
    super(message, HttpStatus.FORBIDDEN);
  }
}

export class NotFoundException extends CustomException {
  constructor(message: string = '资源不存在') {
    super(message, HttpStatus.NOT_FOUND);
  }
}

export class ValidationException extends CustomException {
  constructor(message: string = '数据验证失败') {
    super(message, HttpStatus.BAD_REQUEST);
  }
}

export class ConflictException extends CustomException {
  constructor(message: string = '资源冲突') {
    super(message, HttpStatus.CONFLICT);
  }
}

export class InternalServerException extends CustomException {
  constructor(message: string = '服务器内部错误') {
    super(message, HttpStatus.INTERNAL_SERVER_ERROR);
  }
}

export class BusinessException extends CustomException {
  constructor(message: string, code: number = 1000) {
    super(message, code);
  }
}