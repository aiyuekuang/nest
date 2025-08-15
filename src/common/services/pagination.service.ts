import { Injectable } from '@nestjs/common';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { BaseQueryDto } from '../dto/base.dto';
import { ApiResponseDto } from '../dto/api-response.dto';

export interface PaginationOptions {
  pageIndex?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC' | 'ascend' | 'descend';
}

export interface PaginationResult<T> {
  data: T[];
  total: number;
  pageIndex: number;
  pageSize: number;
}

@Injectable()
export class PaginationService {
  /**
   * 分页查询
   * @param repository 仓库
   * @param filter 过滤条件
   * @param options 分页选项
   * @param relations 关联关系
   * @returns 分页结果
   */
  async paginate<T>(
    repository: Repository<T>,
    filter: any = {},
    options: PaginationOptions = {},
    relations: string[] = []
  ): Promise<PaginationResult<T>> {
    const { pageIndex = 1, pageSize = 10, sortBy = 'createdAt', sortOrder = 'descend' } = options;

    // 构建排序对象
    const order = {
      [sortBy]: sortOrder === 'descend' || sortOrder === 'DESC' ? 'DESC' : 'ASC'
    } as any;

    // 执行查询
    const [data, total] = await repository.findAndCount({
      where: this.filterData(filter),
      skip: (pageIndex - 1) * pageSize,
      take: pageSize,
      order,
      relations
    });

    return {
      data,
      total,
      pageIndex,
      pageSize
    };
  }

  /**
   * 使用QueryBuilder进行分页查询
   * @param queryBuilder 查询构建器
   * @param options 分页选项
   * @returns 分页结果
   */
  async paginateWithQueryBuilder<T>(
    queryBuilder: SelectQueryBuilder<T>,
    options: PaginationOptions = {}
  ): Promise<PaginationResult<T>> {
    const { pageIndex = 1, pageSize = 10, sortBy = 'createdAt', sortOrder = 'descend' } = options;

    // 添加排序
    const orderDirection = sortOrder === 'descend' || sortOrder === 'DESC' ? 'DESC' : 'ASC';
    queryBuilder.orderBy(`${queryBuilder.alias}.${sortBy}`, orderDirection);

    // 添加分页
    queryBuilder.skip((pageIndex - 1) * pageSize).take(pageSize);

    // 执行查询
    const [data, total] = await queryBuilder.getManyAndCount();

    return {
      data,
      total,
      pageIndex,
      pageSize
    };
  }

  /**
   * 过滤数据，移除分页相关字段
   * @param filter 过滤条件
   * @returns 过滤后的条件
   */
  private filterData(filter: any): any {
    const { pageIndex, pageSize, sortBy, sortOrder, ...rest } = filter;
    return rest;
  }

  /**
   * 创建分页响应
   * @param result 分页结果
   * @param dtoClass DTO类
   * @param message 响应消息
   * @returns API响应
   */
  createPaginatedResponse<T, DTO>(
    result: PaginationResult<T>,
    dtoClass: new (data: T) => DTO,
    message = '查询成功'
  ): ApiResponseDto<{
    data: DTO[];
    total: number;
    pageIndex: number;
    pageSize: number;
  }> {
    const dtoData = result.data.map(item => new dtoClass(item));
    
    return ApiResponseDto.paginate(
      dtoData,
      result.total,
      result.pageIndex,
      result.pageSize,
      message
    );
  }
}