import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { HealthService } from './health.service';
import { SkipAuth } from '../../decorators/skip-auth.decorator';

/**
 * 健康检查控制器
 */
@ApiTags('health')
@Controller('health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  /**
   * 健康检查端点
   * @returns 系统健康状态
   */
  @Get()
  @SkipAuth()
  @ApiOperation({ summary: '健康检查' })
  async check() {
    return await this.healthService.check();
  }
}
