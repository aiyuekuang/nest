import { Injectable, Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { RedisClientType } from 'redis';
import { REDIS_CLIENT } from '../redis.module';

export interface CacheOptions {
  ttl?: number;
}

@Injectable()
export class CacheService {
  constructor(
    @Inject(CACHE_MANAGER) private cache: Cache,
    @Inject(REDIS_CLIENT) private redisClient: RedisClientType,
  ) {}

  /**
   * 设置缓存
   * @param key 缓存键
   * @param value 缓存值
   * @param options 缓存选项
   */
  async set(
    key: string,
    value: any,
    options: CacheOptions = {},
  ): Promise<void> {
    const { ttl } = options;
    
    // 同时使用 cache-manager 和 Redis client 存储
    await this.cache.set(key, value, ttl);
    
    // 使用 Redis client 直接存储，确保数据真正写入 Redis
    if (this.redisClient) {
      const valueStr = JSON.stringify(value);
      if (ttl && ttl > 0) {
        // ttl 单位是毫秒，Redis 的 EX 单位是秒，至少 1 秒
        const ttlSeconds = Math.max(1, Math.floor(ttl / 1000));
        await this.redisClient.setEx(key, ttlSeconds, valueStr);
      } else {
        await this.redisClient.set(key, valueStr);
      }
    }
  }

  /**
   * 获取缓存
   * @param key 缓存键
   * @returns 缓存值
   */
  async get<T = any>(key: string): Promise<T | undefined> {
    // 优先从 Redis client 获取
    if (this.redisClient) {
      try {
        const valueStr = await this.redisClient.get(key);
        if (valueStr) {
          return JSON.parse(valueStr) as T;
        }
      } catch (error: any) {
        console.error('Redis client get 失败:', error.message);
      }
    }
    
    // 降级到 cache-manager
    const value = await this.cache.get<T>(key);
    return value === null ? undefined : value;
  }

  /**
   * 删除缓存
   * @param key 缓存键
   */
  async del(key: string): Promise<void> {
    await this.cache.del(key);
    
    // 同时从 Redis client 删除
    if (this.redisClient) {
      await this.redisClient.del(key);
    }
  }

  /**
   * 批量删除缓存
   * @param keys 缓存键数组
   */
  async delMultiple(keys: string[]): Promise<void> {
    for (const key of keys) {
      await this.cache.del(key);
    }
  }

  /**
   * 根据模式删除缓存
   * @param pattern 模式
   */
  async delByPattern(pattern: string): Promise<void> {
    const keys = await this.keys(pattern);
    await this.delMultiple(keys);
  }

  /**
   * 获取所有匹配的键
   * @param pattern 模式
   * @returns 键数组
   */
  async keys(pattern: string): Promise<string[]> {
    try {
      const keys = await this.redisClient.keys(pattern);
      return keys;
    } catch (error: any) {
      console.error('redisClient.keys 调用失败:', error.message);
      return [];
    }
  }

  /**
   * 检查键是否存在
   * @param key 缓存键
   * @returns 是否存在
   */
  async exists(key: string): Promise<boolean> {
    const value = await this.get(key);
    return value !== undefined;
  }

  /**
   * 设置缓存（如果不存在）
   * @param key 缓存键
   * @param value 缓存值
   * @param options 缓存选项
   * @returns 是否设置成功
   */
  async setIfNotExists(
    key: string,
    value: any,
    options: CacheOptions = {},
  ): Promise<boolean> {
    const exists = await this.exists(key);
    if (!exists) {
      await this.set(key, value, options);
      return true;
    }
    return false;
  }

  /**
   * 获取或设置缓存
   * @param key 缓存键
   * @param factory 值工厂函数
   * @param options 缓存选项
   * @returns 缓存值
   */
  async getOrSet<T>(
    key: string,
    factory: () => Promise<T>,
    options: CacheOptions = {},
  ): Promise<T> {
    let value = await this.get<T>(key);
    if (value === undefined) {
      value = await factory();
      await this.set(key, value, options);
    }
    return value;
  }

  /**
   * 清空所有缓存
   */
  async clear(): Promise<void> {
    // cache-manager v5 使用 reset 方法,但类型定义可能不完整
    const cacheWithReset = this.cache as any;
    if (typeof cacheWithReset.reset === 'function') {
      await cacheWithReset.reset();
    }
  }

  /**
   * 获取缓存统计信息
   * @returns 统计信息
   */
  async getStats(): Promise<any> {
    // 这里可以根据具体的缓存实现来获取统计信息
    return {
      // 可以添加缓存统计信息
    };
  }
}
