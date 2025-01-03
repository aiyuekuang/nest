// src/entities/base.entity.ts
import { PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export abstract class ZtBaseEntity {
  /**
   * 实体的主键，自动生成UUID。
   */
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /**
   * 创建时间。
   */
  @CreateDateColumn()
  createdAt: Date;

  /**
   * 创建人。
   */
  @Column({ nullable: true })
  createdBy?: string;

  /**
   * 更新时间。
   */
  @UpdateDateColumn()
  updatedAt: Date;

  /**
   * 更新人。
   */
  @Column({ nullable: true })
  updatedBy?: string;
}
