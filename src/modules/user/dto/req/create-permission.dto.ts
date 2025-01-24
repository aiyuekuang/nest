import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsNumber } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreatePermissionDto {
  @ApiProperty({ description: '名称', example: '测试3' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ description: '标识', example: 'c13' })
  @IsNotEmpty()
  @IsString()
  sign: string;

  @ApiProperty({ description: '父节点ID', example: 'null', nullable: true })
  @IsOptional()
  @IsString()
  parentId: string | null;

  @ApiProperty({ description: '排序', example: 1 })
  @IsNotEmpty()
  @IsNumber()
  sort: number;
}