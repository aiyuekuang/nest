import { createNamespace, getNamespace, Namespace } from 'cls-hooked';

/**
 * 请求上下文命名空间
 */
const REQUEST_CONTEXT = 'REQUEST_CONTEXT';

/**
 * 请求上下文键
 */
export const REQUEST_CONTEXT_KEY = {
  USER: 'user',
  REQUEST_ID: 'requestId',
  IP: 'ip',
  USER_AGENT: 'userAgent',
};

/**
 * 请求上下文管理类
 * 使用cls-hooked在整个请求链路中共享上下文数据
 */
export class RequestContext {
  private static namespace: Namespace;

  /**
   * 初始化命名空间
   */
  static init(): Namespace {
    if (!this.namespace) {
      this.namespace = createNamespace(REQUEST_CONTEXT);
    }
    return this.namespace;
  }

  /**
   * 获取命名空间
   */
  static getNamespace(): Namespace | undefined {
    return getNamespace(REQUEST_CONTEXT);
  }

  /**
   * 设置上下文值
   * @param key 键
   * @param value 值
   */
  static set<T>(key: string, value: T): void {
    const ns = this.getNamespace();
    if (ns && ns.active) {
      ns.set(key, value);
    }
  }

  /**
   * 获取上下文值
   * @param key 键
   * @returns 值
   */
  static get<T>(key: string): T | undefined {
    const ns = this.getNamespace();
    if (ns && ns.active) {
      return ns.get(key);
    }
    return undefined;
  }

  /**
   * 设置当前用户
   * @param user 用户信息
   */
  static setUser(user: any): void {
    this.set(REQUEST_CONTEXT_KEY.USER, user);
  }

  /**
   * 获取当前用户
   * @returns 用户信息
   */
  static getUser<T = any>(): T | undefined {
    return this.get<T>(REQUEST_CONTEXT_KEY.USER);
  }

  /**
   * 设置请求ID
   * @param requestId 请求ID
   */
  static setRequestId(requestId: string): void {
    this.set(REQUEST_CONTEXT_KEY.REQUEST_ID, requestId);
  }

  /**
   * 获取请求ID
   * @returns 请求ID
   */
  static getRequestId(): string | undefined {
    return this.get<string>(REQUEST_CONTEXT_KEY.REQUEST_ID);
  }

  /**
   * 设置IP地址
   * @param ip IP地址
   */
  static setIp(ip: string): void {
    this.set(REQUEST_CONTEXT_KEY.IP, ip);
  }

  /**
   * 获取IP地址
   * @returns IP地址
   */
  static getIp(): string | undefined {
    return this.get<string>(REQUEST_CONTEXT_KEY.IP);
  }

  /**
   * 设置User-Agent
   * @param userAgent User-Agent
   */
  static setUserAgent(userAgent: string): void {
    this.set(REQUEST_CONTEXT_KEY.USER_AGENT, userAgent);
  }

  /**
   * 获取User-Agent
   * @returns User-Agent
   */
  static getUserAgent(): string | undefined {
    return this.get<string>(REQUEST_CONTEXT_KEY.USER_AGENT);
  }
}
