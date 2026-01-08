import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { TaskService } from './task.service';
import { CommonModule } from '../../common/common.module';
import { LoggerModule } from '../../logger/logger.module';

/**
 * 定时任务模块
 */
@Module({
  imports: [ScheduleModule.forRoot(), CommonModule, LoggerModule],
  providers: [TaskService],
})
export class TaskModule {}
