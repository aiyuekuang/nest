import {
  CanActivate,
  ExecutionContext,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { SKIP_AUTH_KEY } from '../decorators/skip-auth.decorator';
import { CacheService } from '../common/services/cache.service';
import { UnauthorizedException } from '../common/exceptions/custom.exception';
import { reqUser } from '../utils/nameSpace';
import { RequestContext } from '../common/context/request-context';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly cacheService: CacheService,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const skipAuth = this.reflector.getAllAndOverride<boolean>(SKIP_AUTH_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (skipAuth) {
      return true;
    }

    const http = context.switchToHttp();
    const request = http.getRequest<any>();

    // 获取用户信息
    const user = await this.getUser(request);
    
    // 挂载到请求对象
    request[reqUser] = user;
    
    // 设置到请求上下文
    RequestContext.setUser(user);

    return true;
  }

  /**
   * 获取用户信息
   * @param request 请求对象
   * @returns 用户信息
   */
  public async getUser(request: any): Promise<any> {
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
  private async extractTokenFromHeader(request: any): Promise<any> {
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
