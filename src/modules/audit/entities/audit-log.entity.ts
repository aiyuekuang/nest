import { Entity, Column } from 'typeorm';
import { BaseEntity } from '../../../utils/base.entity';

/**
 * 审计日志实体
 */
@Entity('audit_log')
export class AuditLog extends BaseEntity {
  /**
   * 用户ID
   */
  @Column({ name: 'user_id', nullable: true })
  userId?: string;

  /**
   * 用户名
   */
  @Column({ nullable: true })
  username?: string;

  /**
   * 操作类型（CREATE, UPDATE, DELETE, LOGIN, LOGOUT等）
   */
  @Column({ name: 'action_type' })
  actionType!: string;

  /**
   * 资源类型（User, Role, Permission等）
   */
  @Column({ name: 'resource_type', nullable: true })
  resourceType?: string;

  /**
   * 资源ID
   */
  @Column({ name: 'resource_id', nullable: true })
  resourceId?: string;

  /**
   * 操作描述
   */
  @Column({ type: 'text', nullable: true })
  description?: string;

  /**
   * 请求方法
   */
  @Column({ nullable: true })
  method?: string;

  /**
   * 请求路径
   */
  @Column({ nullable: true })
  path?: string;

  /**
   * IP地址
   */
  @Column({ nullable: true })
  ip?: string;

  /**
   * User-Agent
   */
  @Column({ name: 'user_agent', type: 'text', nullable: true })
  userAgent?: string;

  /**
   * 请求参数（JSON格式）
   */
  @Column({ type: 'text', nullable: true })
  params?: string;

  /**
   * 变更前数据（JSON格式）
   */
  @Column({ name: 'old_data', type: 'text', nullable: true })
  oldData?: string;

  /**
   * 变更后数据（JSON格式）
   */
  @Column({ name: 'new_data', type: 'text', nullable: true })
  newData?: string;

  /**
   * 操作状态（SUCCESS, FAILED）
   */
  @Column({ default: 'SUCCESS' })
  status!: string;

  /**
   * 错误信息
   */
  @Column({ name: 'error_message', type: 'text', nullable: true })
  errorMessage?: string;

  /**
   * 请求ID
   */
  @Column({ name: 'request_id', nullable: true })
  requestId?: string;
}
