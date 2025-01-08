// src/entities/base.entity.ts
import { Column, CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

export abstract class ZtBaseEntity {
  /**
   * 实体的主键，自动生成UUID。
   */
  @PrimaryGeneratedColumn("uuid")
  id: string;

  /**
   * 创建时间，时间使用 ISO 格式，并且精确到秒。
   */
  @CreateDateColumn({
    type: "timestamp",
    name: "created_at",
    precision: 0, // Precision to seconds
    default: () => "CURRENT_TIMESTAMP" // 设置默认值为 CURRENT_TIMESTAMP
  })
  createdAt: Date;

  /**
   * 创建人。
   */
  @Column({ nullable: true, name: "created_by" })
  createdBy?: string;

  /**
   * 更新时间，时间使用 ISO 格式，并且精确到秒。
   */
  @UpdateDateColumn({
    type: "timestamp",
    name: "updated_at",
    precision: 0, // Precision to seconds
    default: () => "CURRENT_TIMESTAMP",
    onUpdate: "CURRENT_TIMESTAMP" // 设置更新时自动更新时间
  })
  updatedAt: Date;

  /**
   * 更新人。
   */
  @Column({ nullable: true, name: "updated_by" })
  updatedBy?: string;
}
