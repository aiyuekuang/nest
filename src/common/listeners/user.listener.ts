import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import {
  UserCreatedEvent,
  UserUpdatedEvent,
  UserDeletedEvent,
  UserLoginEvent,
  UserLogoutEvent,
} from '../events/user.events';
import { LoggerService } from '../../logger/logger.service';
import { AuditService } from '../../modules/audit/audit.service';

/**
 * 用户事件监听器
 */
@Injectable()
export class UserListener {
  constructor(
    private readonly logger: LoggerService,
    private readonly auditService: AuditService,
  ) {}

  /**
   * 监听用户创建事件
   * @param event 用户创建事件
   */
  @OnEvent('user.created')
  async handleUserCreated(event: UserCreatedEvent) {
    this.logger.info(`用户创建事件: ${event.username}`);
    
    // 记录审计日志
    await this.auditService.logCreate('User', event.userId, {
      username: event.username,
      email: event.email,
    });
  }

  /**
   * 监听用户更新事件
   * @param event 用户更新事件
   */
  @OnEvent('user.updated')
  async handleUserUpdated(event: UserUpdatedEvent) {
    this.logger.info(`用户更新事件: ${event.userId}`);
    
    // 记录审计日志
    await this.auditService.logUpdate(
      'User',
      event.userId,
      event.oldData,
      event.newData,
    );
  }

  /**
   * 监听用户删除事件
   * @param event 用户删除事件
   */
  @OnEvent('user.deleted')
  async handleUserDeleted(event: UserDeletedEvent) {
    this.logger.info(`用户删除事件: ${event.username}`);
    
    // 记录审计日志
    await this.auditService.logDelete('User', event.userId, {
      username: event.username,
    });
  }

  /**
   * 监听用户登录事件
   * @param event 用户登录事件
   */
  @OnEvent('user.login')
  async handleUserLogin(event: UserLoginEvent) {
    this.logger.info(`用户登录事件: ${event.username} from ${event.ip}`);
    
    // 记录审计日志
    await this.auditService.logLogin(event.username, true);
  }

  /**
   * 监听用户登出事件
   * @param event 用户登出事件
   */
  @OnEvent('user.logout')
  async handleUserLogout(event: UserLogoutEvent) {
    this.logger.info(`用户登出事件: ${event.username}`);
    
    // 记录审计日志
    await this.auditService.logLogout(event.username);
  }
}
