import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  LoggerService,
  UnauthorizedException
} from "@nestjs/common";
import { Request } from "express";
import { ConfigService } from "@nestjs/config";
import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { Cache } from "cache-manager";
import { SKIP_AUTH_KEY } from "../decorators/skip-auth.decorator";
import { Reflector } from "@nestjs/core";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private configService: ConfigService, // 注入配置服务，用于获取配置
    @Inject(CACHE_MANAGER) private cache: Cache, // 注入缓存管理器���用于处理缓存
  private reflector: Reflector // 注入 Reflector 服务
  ) {
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {

    const skipAuth = this.reflector.getAllAndOverride<boolean>(SKIP_AUTH_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (skipAuth) {
      return true; // 如果存在 SkipAuth 装饰器，跳过验证
    }

    const http = context.switchToHttp(); // 获取HTTP上下文
    const request = http.getRequest<Request>(); // 获取请求对象


    // 💡 在这里我们将 payload 挂载到请求对象上
    // 以便我们可以在路由处理器中访问它
    request["user"] = await this.getUser(request); // 获取用户信息并挂载到请求对象上

    console.log(`用户信息：${request["user"]}`); // 打印用户信息
    return true; // 返回true，允许请求通过
  }

  public async getUser(request: Request) {
    const user = await this.extractTokenFromHeader(request); // 从请求头中提取token

    if (!user) {
      throw new UnauthorizedException("请先登陆"); // 如果没有token，抛出未授权异常
    }

    try {
      // 验证JWT token
      return user;
    } catch {
      throw new UnauthorizedException("请先登陆"); // 如果验证失败，抛出未授权异常
    }
  }

  private async extractTokenFromHeader(request: Request): Promise<string> {
    const [type, tokenStr] = request.headers.authorization?.split(" ") ?? []; // 从请求头中提取token类型和token字符串
    console.log(tokenStr,type);


    if (!type || !tokenStr) {
      return undefined; // 如果没有token类型或token字符串，返回undefined
    }
    if (type === "Bearer") {
      // 从缓存中获取token
      const user = await this.cache.store.keys(`${tokenStr}-*`);
      console.log(user);
      if (user && user.length) {

        return user[0]; // 返回用户信息
      }
    }
    return undefined;

  }
}
