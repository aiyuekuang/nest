import { Module } from '@nestjs/common';
import { HealthController } from './health.controller';
import { HealthService } from './health.service';
import { CommonModule } from '../../common/common.module';

/**
 * 健康检查模块
 */
@Module({
  imports: [CommonModule],
  controllers: [HealthController],
  providers: [HealthService],
})
export class HealthModule {}
