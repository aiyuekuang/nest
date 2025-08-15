import { Injectable, Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

export interface CacheOptions {
  ttl?: number;
}

@Injectable()
export class CacheService {
  constructor(@Inject(CACHE_MANAGER) private cache: Cache) {}

  /**
   * 设置缓存
   * @param key 缓存键
   * @param value 缓存值
   * @param options 缓存选项
   */
  async set(key: string, value: any, options: CacheOptions = {}): Promise<void> {
    const { ttl } = options;
    await this.cache.set(key, value, ttl);
  }

  /**
   * 获取缓存
   * @param key 缓存键
   * @returns 缓存值
   */
  async get<T = any>(key: string): Promise<T | undefined> {
    return await this.cache.get<T>(key);
  }

  /**
   * 删除缓存
   * @param key 缓存键
   */
  async del(key: string): Promise<void> {
    await this.cache.del(key);
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
    return await this.cache.store.keys(pattern);
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
  async setIfNotExists(key: string, value: any, options: CacheOptions = {}): Promise<boolean> {
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
    options: CacheOptions = {}
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
    await this.cache.reset();
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