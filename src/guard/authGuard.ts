import { CanActivate, ExecutionContext, Inject, Injectable } from '@nestjs/common';
import { Request } from 'express';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';

import { SKIP_AUTH_KEY } from '../decorators/skip-auth.decorator';
import { CacheService } from '../common/services/cache.service';
import { UnauthorizedException } from '../common/exceptions/custom.exception';
import { reqUser } from '../utils/nameSpace';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private configService: ConfigService,
    private readonly cacheService: CacheService,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const skipAuth = this.reflector.getAllAndOverride<boolean>(SKIP_AUTH_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (skipAuth) {
      return true; // 如果存在 SkipAuth 装饰器，跳过验证
    }

    const http = context.switchToHttp();
    const request = http.getRequest<Request>();

    // 获取用户信息并挂载到请求对象上
    request[reqUser] = await this.getUser(request);

    return true;
  }

  /**
   * 获取用户信息
   * @param request 请求对象
   * @returns 用户信息
   */
  public async getUser(request: Request): Promise<any> {
    const user = await this.extractTokenFromHeader(request);

    if (!user) {
      throw new UnauthorizedException('请先登录');
    }

    return user;
  }

  /**
   * 从请求头中提取token并获取用户信息
   * @param request 请求对象
   * @returns 用户信息
   */
  private async extractTokenFromHeader(request: Request): Promise<any> {
    const [type, tokenStr] = request.headers.authorization?.split(' ') ?? [];

    if (type !== 'Bearer' || !tokenStr) {
      return null;
    }

    const tokenKey = `${tokenStr}-*`;
    const userKeys = await this.cacheService.keys(tokenKey);

    if (userKeys && userKeys.length > 0) {
      return await this.cacheService.get(userKeys[0]);
    }

    return null;
  }
}
