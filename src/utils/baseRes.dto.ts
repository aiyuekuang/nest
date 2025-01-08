// src/entities/base.entity.ts

import { User } from "../modules/user/entities/user.entity";

export abstract class ZtBaseResDto {
  /**
   * 当前页码。
   *
   * */
  current?: number;

  /**
   * 总页数。
   *
   * */
  total?: number;

  /**
   * 每页显示的记录数。
   *
   */
  pageSize?: number;

  protected constructor(current?: number, total?: number, pageSize?: number) {
    this.current = current;
    this.total = total;
    this.pageSize = pageSize;
  }
}
