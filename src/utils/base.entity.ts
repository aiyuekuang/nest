// src/entities/base.entity.ts
import { Column, CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Transform } from "class-transformer";
import moment from "moment";

export abstract class ZtBaseEntity {
  /**
   * 实体的主键，自动生成UUID。
   */
  @PrimaryGeneratedColumn("uuid")
  id: string;

  /**
   * 创建时间。
   */
  @CreateDateColumn({
    type: "timestamp",
    name: "created_at",
    precision: 0, // 精确到秒
    default: () => "CURRENT_TIMESTAMP" // 设置默认值为 CURRENT_TIMESTAMP
  })
  @Transform(({ value }) =>
    value ? moment(value).format("YYYY-MM-DD HH:mm:ss") : null
  )
  createdAt: Date;

  /**
   * 创建人。
   */
  @Column({ nullable: true,name:"created_by" })
  createdBy?: string;

  /**
   * 更新时间。
   */
  @UpdateDateColumn({
    type: "timestamp",
    name: "updated_at",
    precision: 0, // Precision to seconds
    default: () => "CURRENT_TIMESTAMP", // 设置默认值为 CURRENT_TIMESTAMP
    onUpdate: "CURRENT_TIMESTAMP" // Set on update to CURRENT_TIMESTAMP
  })
  @Transform(({ value }) =>
    value ? moment(value).format("YYYY-MM-DD HH:mm:ss") : null
  )
  updatedAt: Date;

  /**
   * 更新人。
   */
  @Column({ nullable: true,name:"updated_by" })
  updatedBy?: string;
}
