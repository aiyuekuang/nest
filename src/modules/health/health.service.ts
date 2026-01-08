import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { CacheService } from '../../common/services/cache.service';
import { ApiResponseDto } from '../../common/dto/api-response.dto';

/**
 * 健康检查服务
 */
@Injectable()
export class HealthService {
  constructor(
    @InjectDataSource() private dataSource: DataSource,
    private readonly cacheService: CacheService,
  ) {}

  /**
   * 检查系统健康状态
   * @returns 健康状态信息
   */
  async check(): Promise<ApiResponseDto<any>> {
    const health = {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
      memory: {
        used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
        total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024),
        unit: 'MB',
      },
      database: await this.checkDatabase(),
      redis: await this.checkRedis(),
    };

    return ApiResponseDto.success(health, '系统运行正常');
  }

  /**
   * 检查数据库连接
   * @returns 数据库状态
   */
  private async checkDatabase(): Promise<{ status: string; message?: string }> {
    try {
      await this.dataSource.query('SELECT 1');
      return { status: 'connected' };
    } catch (error: any) {
      return { status: 'disconnected', message: error?.message || '未知错误' };
    }
  }

  /**
   * 检查Redis连接
   * @returns Redis状态
   */
  private async checkRedis(): Promise<{ status: string; message?: string }> {
    try {
      const testKey = 'health_check_test';
      await this.cacheService.set(testKey, 'ok', { ttl: 10 });
      const value = await this.cacheService.get(testKey);
      await this.cacheService.del(testKey);

      if (value === 'ok') {
        return { status: 'connected' };
      }
      return { status: 'error', message: '缓存读写测试失败' };
    } catch (error: any) {
      return { status: 'disconnected', message: error?.message || '未知错误' };
    }
  }
}
