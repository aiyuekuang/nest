import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuditLog } from './entities/audit-log.entity';
import { RequestContext } from '../../common/context/request-context';

/**
 * 审计日志操作类型
 */
export enum AuditActionType {
  CREATE = 'CREATE',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
  LOGIN = 'LOGIN',
  LOGOUT = 'LOGOUT',
  VIEW = 'VIEW',
  EXPORT = 'EXPORT',
  IMPORT = 'IMPORT',
}

/**
 * 审计日志服务
 */
@Injectable()
export class AuditService {
  constructor(
    @InjectRepository(AuditLog)
    private readonly auditLogRepository: Repository<AuditLog>,
  ) {}

  /**
   * 创建审计日志
   * @param data 审计日志数据
   */
  async log(data: Partial<AuditLog>): Promise<void> {
    try {
      const user = RequestContext.getUser();
      const requestId = RequestContext.getRequestId();
      const ip = RequestContext.getIp();
      const userAgent = RequestContext.getUserAgent();

      const auditLog = this.auditLogRepository.create({
        userId: user?.id,
        username: user?.username,
        requestId,
        ip,
        userAgent,
        status: 'SUCCESS',
        ...data,
      });

      await this.auditLogRepository.save(auditLog);
    } catch (error) {
      // 审计日志失败不应影响业务流程
      console.error('审计日志记录失败:', error);
    }
  }

  /**
   * 记录创建操作
   * @param resourceType 资源类型
   * @param resourceId 资源ID
   * @param newData 新数据
   * @param description 描述
   */
  async logCreate(
    resourceType: string,
    resourceId: string,
    newData: any,
    description?: string,
  ): Promise<void> {
    await this.log({
      actionType: AuditActionType.CREATE,
      resourceType,
      resourceId,
      newData: JSON.stringify(newData),
      description: description || `创建${resourceType}`,
    });
  }

  /**
   * 记录更新操作
   * @param resourceType 资源类型
   * @param resourceId 资源ID
   * @param oldData 旧数据
   * @param newData 新数据
   * @param description 描述
   */
  async logUpdate(
    resourceType: string,
    resourceId: string,
    oldData: any,
    newData: any,
    description?: string,
  ): Promise<void> {
    await this.log({
      actionType: AuditActionType.UPDATE,
      resourceType,
      resourceId,
      oldData: JSON.stringify(oldData),
      newData: JSON.stringify(newData),
      description: description || `更新${resourceType}`,
    });
  }

  /**
   * 记录删除操作
   * @param resourceType 资源类型
   * @param resourceId 资源ID
   * @param oldData 旧数据
   * @param description 描述
   */
  async logDelete(
    resourceType: string,
    resourceId: string,
    oldData: any,
    description?: string,
  ): Promise<void> {
    await this.log({
      actionType: AuditActionType.DELETE,
      resourceType,
      resourceId,
      oldData: JSON.stringify(oldData),
      description: description || `删除${resourceType}`,
    });
  }

  /**
   * 记录登录操作
   * @param username 用户名
   * @param success 是否成功
   * @param errorMessage 错误信息
   */
  async logLogin(
    username: string,
    success: boolean,
    errorMessage?: string,
  ): Promise<void> {
    await this.log({
      actionType: AuditActionType.LOGIN,
      username,
      description: success ? '用户登录成功' : '用户登录失败',
      status: success ? 'SUCCESS' : 'FAILED',
      errorMessage,
    });
  }

  /**
   * 记录登出操作
   * @param username 用户名
   */
  async logLogout(username: string): Promise<void> {
    await this.log({
      actionType: AuditActionType.LOGOUT,
      username,
      description: '用户登出',
    });
  }

  /**
   * 查询审计日志
   * @param filter 过滤条件
   * @returns 审计日志列表
   */
  async findAll(filter: any): Promise<{ data: AuditLog[]; total: number }> {
    const { pageIndex = 1, pageSize = 10, ...where } = filter;

    const [data, total] = await this.auditLogRepository.findAndCount({
      where,
      skip: (pageIndex - 1) * pageSize,
      take: pageSize,
      order: { createdAt: 'DESC' },
    });

    return { data, total };
  }
}
