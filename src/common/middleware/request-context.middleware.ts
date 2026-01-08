import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { RequestContext } from '../context/request-context';

/**
 * 请求上下文中间件
 * 为每个请求创建独立的上下文
 */
@Injectable()
export class RequestContextMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const namespace = RequestContext.init();

    namespace.run(() => {
      // 生成请求ID
      const requestId = uuidv4();
      RequestContext.setRequestId(requestId);

      // 设置IP地址
      const ip = req.ip || req.connection.remoteAddress || '';
      RequestContext.setIp(ip);

      // 设置User-Agent
      const userAgent = req.headers['user-agent'] || '';
      RequestContext.setUserAgent(userAgent);

      // 将请求ID添加到响应头
      res.setHeader('X-Request-Id', requestId);

      next();
    });
  }
}
