import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { LoggerService } from '../../logger/logger.service';
import { CacheService } from '../../common/services/cache.service';

/**
 * 定时任务服务
 */
@Injectable()
export class TaskService {
  constructor(
    private readonly logger: LoggerService,
    private readonly cacheService: CacheService,
  ) {}

  /**
   * 清理过期缓存
   * 每天凌晨3点执行
   */
  @Cron(CronExpression.EVERY_DAY_AT_3AM)
  async cleanExpiredCache() {
    this.logger.info('开始清理过期缓存');
    try {
      // 这里可以添加具体的清理逻辑
      this.logger.info('过期缓存清理完成');
    } catch (error) {
      this.logger.error('清理过期缓存失败:', error);
    }
  }

  /**
   * 清理过期审计日志
   * 每周日凌晨2点执行
   */
  @Cron(CronExpression.EVERY_WEEK)
  async cleanOldAuditLogs() {
    this.logger.info('开始清理过期审计日志');
    try {
      // 这里可以添加具体的清理逻辑
      // 例如：删除90天前的审计日志
      this.logger.info('过期审计日志清理完成');
    } catch (error) {
      this.logger.error('清理过期审计日志失败:', error);
    }
  }

  /**
   * 健康检查
   * 每5分钟执行一次
   */
  @Cron(CronExpression.EVERY_5_MINUTES)
  async healthCheck() {
    this.logger.debug('执行健康检查');
    try {
      // 检查关键服务状态
      const cacheStatus = await this.cacheService.exists('health_check');
      if (!cacheStatus) {
        await this.cacheService.set('health_check', 'ok', { ttl: 300 });
      }
    } catch (error) {
      this.logger.error('健康检查失败:', error);
    }
  }

  /**
   * 生成统计报表
   * 每天凌晨1点执行
   */
  @Cron(CronExpression.EVERY_DAY_AT_1AM)
  async generateDailyReport() {
    this.logger.info('开始生成每日统计报表');
    try {
      // 这里可以添加报表生成逻辑
      this.logger.info('每日统计报表生成完成');
    } catch (error) {
      this.logger.error('生成每日统计报表失败:', error);
    }
  }
}
