// src/entities/base.entity.ts
import { Column, CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

export abstract class ZtBaseReqDto {
  /**
  * 当前页码。
  *
  * */
  pageIndex?: number;

  /**
   * 每页显示的记录数。
   *
   */
  pageSize?: number;
}
