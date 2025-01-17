// src/entities/base.entity.ts

export class ZtBaseResDto {
  /**
   * 当前页码。
   *
   * */
  pageIndex?: number;

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

  /**
   * 分页后的数据主体。
   *
   */
  data?: any[];

  constructor(filter: any, res: any, Dto: any) {
    const { pageIndex, pageSize } = filter;
    const [data, total] = res;
    this.pageIndex = pageIndex;
    this.total = total;
    this.pageSize = pageSize;
    this.data = data.map((data2)=>{
      return new Dto(data2)
    });
  }
}
