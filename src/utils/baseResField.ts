// src/entities/base.entity.ts
import { Column, CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Transform } from "class-transformer";
import moment from "moment";

export class ZtBaseEntity {
  /**
   * 创建时间，时间使用 ISO 格式，并且精确到秒。
   */
  @Transform(({ value }) => moment(value).format("YYYY-MM-DD HH:mm:ss"))
  createdAt: Date;

  /**
   * 创建人。
   */
  @Column({ nullable: true, name: "created_by" })
  createdBy?: string;

  /**
   * 更新时间，时间使用 ISO 格式，并且精确到秒。
   */
  @Transform(({ value }) => moment(value).format("YYYY-MM-DD HH:mm:ss"))
  updatedAt: Date;

  /**
   * 更新人。
   */
  @Column({ nullable: true, name: "updated_by" })
  updatedBy?: string;
}
