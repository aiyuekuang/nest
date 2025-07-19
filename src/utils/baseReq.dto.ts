// src/entities/base.entity.ts

// 排序字段{"sort":{"sortBy":"createdAt","sortOrder":"descend"}}
import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsOptional, IsString } from "class-validator";

/**
 * 排序字段。
 * */
class Sort {
  @ApiProperty({ required: false, description: '排序字段', example: 'createdAt' })
  @IsString()
  sortBy: string;
  @ApiProperty({ required: false, description: '排序顺序', example: 'descend' })
  @IsString()
  sortOrder: string;
}

/**
 * 基础实体类，包含分页和排序字段。
 * */
export class BaseRequestDto {
  /**
   * 当前页码。
   *
   * */
  @ApiProperty({ required: false, description: '当前页码', example: 1 })
  @IsNumber()
  pageIndex?: number;

  /**
   * 每页显示的记录数。
   *
   */
  @ApiProperty({ required: false, description: '每页显示的记录数', example: 10 })
  @IsNumber()
  pageSize?: number;

  /**
   * 排序字段。
   *
   */
  @ApiProperty({ required: false, description: '排序字段', example: { sortBy: 'createdAt', sortOrder: 'descend' } })
  @IsOptional()
  sort?: Sort;

}
