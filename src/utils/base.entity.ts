// src/entities/base.entity.ts
import { Column, CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Transform } from "class-transformer";
import * as moment from "moment";

export class BaseEntity {
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
  @Transform(({ value }) => {
  // 转换成YYYY-MM-DD HH:mm:ss格式
    return moment(value).format("YYYY-MM-DD HH:mm:ss");
  })
  createdAt: Date;

  /**
   * 创建人。
   */
  @Column({ nullable: true, name: "created_by" })
  @Transform(({ value }) => value || "system")
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
  @Transform(({ value }) => moment(value).format("YYYY-MM-DD HH:mm:ss"))
  updatedAt: Date;

  /**
   * 更新人，默认值
   */
  @Column({ nullable: true, name: "updated_by" })
  @Transform(({ value }) => value || "system")
  updatedBy?: string;
}
