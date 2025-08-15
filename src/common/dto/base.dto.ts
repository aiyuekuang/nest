import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsUUID, IsDateString, IsString, IsNumber } from 'class-validator';
import { Transform } from 'class-transformer';

export abstract class BaseDto {
  @ApiProperty({ required: false, description: '实体ID' })
  @IsOptional()
  @IsUUID()
  id?: string;

  @ApiProperty({ required: false, description: '创建时间' })
  @IsOptional()
  @IsDateString()
  createdAt?: Date;

  @ApiProperty({ required: false, description: '更新时间' })
  @IsOptional()
  @IsDateString()
  updatedAt?: Date;

  @ApiProperty({ required: false, description: '创建人' })
  @IsOptional()
  @IsString()
  createdBy?: string;

  @ApiProperty({ required: false, description: '更新人' })
  @IsOptional()
  @IsString()
  updatedBy?: string;
}

export abstract class BaseCreateDto extends BaseDto {
  @ApiProperty({ required: false, description: '状态' })
  @IsOptional()
  @IsString()
  status?: string;
}

export abstract class BaseUpdateDto extends BaseDto {
  @ApiProperty({ required: true, description: '实体ID' })
  @IsUUID()
  id: string;
}

export abstract class BaseQueryDto extends BaseDto {
  @ApiProperty({ required: false, description: '当前页码', example: 1 })
  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => parseInt(value))
  pageIndex?: number = 1;

  @ApiProperty({ required: false, description: '每页数量', example: 10 })
  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => parseInt(value))
  pageSize?: number = 10;

  @ApiProperty({ required: false, description: '排序字段', example: 'createdAt' })
  @IsOptional()
  @IsString()
  sortBy?: string = 'createdAt';

  @ApiProperty({ required: false, description: '排序顺序', example: 'descend' })
  @IsOptional()
  @IsString()
  sortOrder?: string = 'descend';
}